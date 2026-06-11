import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    // 1. Verify table by QR token
    const table = await this.prisma.table.findUnique({
      where: { qrToken: dto.tableToken },
    });

    if (!table || !table.isActive) {
      throw new BadRequestException('Invalid or inactive table QR token');
    }

    // 2. Fetch menu items and validate
    const menuItemIds = dto.items.map((i) => i.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, isAvailable: true },
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new BadRequestException('One or more menu items are unavailable or not found');
    }

    // 2b. Validasi stok cukup untuk tiap item
    for (const orderItem of dto.items) {
      const menuItem = menuItems.find((m) => m.id === orderItem.menuItemId)!;
      if (orderItem.qty > menuItem.stock) {
        throw new BadRequestException(
          `Stok ${menuItem.name} tidak cukup. Tersisa ${menuItem.stock}.`,
        );
      }
    }

    // 3. Check active discounts for member
    let discountMap = new Map<string, { type: string; value: Prisma.Decimal }>();
    if (dto.memberId) {
      const now = new Date();
      const activeDiscounts = await this.prisma.discountEvent.findMany({
        where: {
          isActive: true,
          startAt: { lte: now },
          endAt: { gte: now },
        },
        include: { items: true },
      });

      for (const discount of activeDiscounts) {
        if (discount.appliesToAll) {
          for (const mi of menuItems) {
            discountMap.set(mi.id, { type: discount.type, value: discount.value });
          }
        } else {
          for (const item of discount.items) {
            discountMap.set(item.menuItemId, { type: discount.type, value: discount.value });
          }
        }
      }
    }

    // 4. Calculate totals
    let subtotal = new Prisma.Decimal(0);
    let discountTotal = new Prisma.Decimal(0);

    const orderItemsData = dto.items.map((orderItem) => {
      const menuItem = menuItems.find((m) => m.id === orderItem.menuItemId)!;
      const unitPrice = menuItem.price;
      const itemSubtotal = unitPrice.mul(orderItem.qty);
      subtotal = subtotal.add(itemSubtotal);

      let discountAmount = new Prisma.Decimal(0);
      const discount = discountMap.get(menuItem.id);
      if (discount) {
        if (discount.type === 'percentage') {
          discountAmount = itemSubtotal.mul(discount.value).div(100);
        } else {
          discountAmount = discount.value.mul(orderItem.qty);
        }
        discountTotal = discountTotal.add(discountAmount);
      }

      return {
        menuItemId: orderItem.menuItemId,
        qty: orderItem.qty,
        unitPrice,
        discountAmount,
      };
    });

    const grandTotal = subtotal.sub(discountTotal);

    // 5. Create order with items in a transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          tableId: table.id,
          memberId: dto.memberId || null,
          notes: dto.notes,
          subtotal,
          discountTotal,
          grandTotal,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          table: { select: { tableNumber: true } },
          orderItems: {
            include: {
              menuItem: { select: { id: true, name: true, imageUrl: true } },
            },
          },
          member: { select: { id: true, name: true } },
        },
      });

      // Deduct stock for each item
      for (const item of dto.items) {
        await tx.menuItem.update({
          where: { id: item.menuItemId },
          data: { stock: { decrement: item.qty } },
        });
      }

      return newOrder;
    });

    return order;
  }

  async findAll(status?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where = status ? { status: status as 'waiting' | 'confirmed' | 'cancelled' } : {};

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          table: { select: { tableNumber: true } },
          member: { select: { id: true, name: true } },
          orderItems: {
            include: {
              menuItem: { select: { id: true, name: true, imageUrl: true } },
            },
          },
          payments: { select: { id: true, method: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        table: { select: { tableNumber: true } },
        member: { select: { id: true, name: true } },
        confirmer: { select: { id: true, name: true } },
        orderItems: {
          include: {
            menuItem: { select: { id: true, name: true, imageUrl: true, price: true } },
          },
        },
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async confirm(id: string, confirmedBy: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (order.status !== 'waiting') {
      throw new BadRequestException(`Order is already ${order.status}`);
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: 'confirmed',
        confirmedAt: new Date(),
        confirmedBy,
      },
      include: {
        table: { select: { tableNumber: true } },
        orderItems: {
          include: {
            menuItem: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async cancel(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (order.status !== 'waiting') {
      throw new BadRequestException(`Only waiting orders can be cancelled`);
    }

    // Restore stock and cancel order in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Restore stock for each item
      for (const item of order.orderItems) {
        await tx.menuItem.update({
          where: { id: item.menuItemId },
          data: { stock: { increment: item.qty } },
        });
      }

      return tx.order.update({
        where: { id },
        data: { status: 'cancelled' },
        include: {
          table: { select: { tableNumber: true } },
          orderItems: {
            include: {
              menuItem: { select: { id: true, name: true } },
            },
          },
        },
      });
    });
  }
}
