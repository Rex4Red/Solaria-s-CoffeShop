import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async adjust(dto: AdjustInventoryDto, createdBy: string) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: dto.menuItemId },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${dto.menuItemId} not found`);
    }

    const newStock = menuItem.stock + dto.changeQty;
    if (newStock < 0) {
      throw new BadRequestException(
        `Insufficient stock. Current: ${menuItem.stock}, change: ${dto.changeQty}`,
      );
    }

    // Update stock and create log in a transaction
    const [updatedItem, log] = await this.prisma.$transaction([
      this.prisma.menuItem.update({
        where: { id: dto.menuItemId },
        data: { stock: { increment: dto.changeQty } },
        include: {
          category: { select: { id: true, name: true } },
        },
      }),
      this.prisma.inventoryLog.create({
        data: {
          menuItemId: dto.menuItemId,
          changeQty: dto.changeQty,
          reason: dto.reason,
          createdBy,
        },
      }),
    ]);

    return {
      menuItem: updatedItem,
      log,
    };
  }

  async findLogs(menuItemId?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = menuItemId ? { menuItemId } : {};

    const [logs, total] = await Promise.all([
      this.prisma.inventoryLog.findMany({
        where,
        include: {
          menuItem: { select: { id: true, name: true, stock: true } },
          creator: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.inventoryLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getLowStock(threshold = 10) {
    return this.prisma.menuItem.findMany({
      where: {
        stock: { lte: threshold },
        isAvailable: true,
      },
      include: {
        category: { select: { id: true, name: true } },
      },
      orderBy: { stock: 'asc' },
    });
  }
}
