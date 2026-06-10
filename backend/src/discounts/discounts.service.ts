import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Injectable()
export class DiscountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDiscountDto) {
    const { menuItemIds, ...data } = dto;

    return this.prisma.discountEvent.create({
      data: {
        name: data.name,
        type: data.type,
        value: data.value,
        startAt: new Date(data.startAt),
        endAt: new Date(data.endAt),
        isActive: data.isActive ?? true,
        appliesToAll: data.appliesToAll ?? false,
        items: menuItemIds && menuItemIds.length > 0
          ? {
              create: menuItemIds.map((menuItemId) => ({
                menuItemId,
              })),
            }
          : undefined,
      },
      include: {
        items: {
          include: {
            menuItem: { select: { id: true, name: true, price: true } },
          },
        },
      },
    });
  }

  async findAll(activeOnly = false) {
    const now = new Date();

    return this.prisma.discountEvent.findMany({
      where: activeOnly
        ? {
            isActive: true,
            startAt: { lte: now },
            endAt: { gte: now },
          }
        : {},
      include: {
        items: {
          include: {
            menuItem: { select: { id: true, name: true, price: true } },
          },
        },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const discount = await this.prisma.discountEvent.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: { select: { id: true, name: true, price: true } },
          },
        },
      },
    });

    if (!discount) {
      throw new NotFoundException(`Discount event with ID ${id} not found`);
    }

    return discount;
  }

  async update(id: string, dto: UpdateDiscountDto) {
    await this.findOne(id);

    const { menuItemIds, ...data } = dto;

    // If menuItemIds provided, replace all items
    if (menuItemIds !== undefined) {
      await this.prisma.discountEventItem.deleteMany({
        where: { eventId: id },
      });

      if (menuItemIds.length > 0) {
        await this.prisma.discountEventItem.createMany({
          data: menuItemIds.map((menuItemId) => ({
            eventId: id,
            menuItemId,
          })),
        });
      }
    }

    return this.prisma.discountEvent.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.type && { type: data.type }),
        ...(data.value !== undefined && { value: data.value }),
        ...(data.startAt && { startAt: new Date(data.startAt) }),
        ...(data.endAt && { endAt: new Date(data.endAt) }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.appliesToAll !== undefined && { appliesToAll: data.appliesToAll }),
      },
      include: {
        items: {
          include: {
            menuItem: { select: { id: true, name: true, price: true } },
          },
        },
      },
    });
  }

  async remove(id: string) {
    const discount = await this.findOne(id);

    await this.prisma.discountEvent.delete({ where: { id } });
    return { message: `Discount event "${discount.name}" deleted successfully` };
  }
}
