import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [members, total] = await Promise.all([
      this.prisma.profile.findMany({
        where: { role: 'member' },
        select: {
          id: true,
          authUserId: true,
          name: true,
          phone: true,
          points: true,
          createdAt: true,
          _count: {
            select: { ordersAsMember: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.profile.count({ where: { role: 'member' } }),
    ]);

    return {
      data: members,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const member = await this.prisma.profile.findUnique({
      where: { id },
      include: {
        ordersAsMember: {
          select: {
            id: true,
            status: true,
            grandTotal: true,
            createdAt: true,
            table: { select: { tableNumber: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { ordersAsMember: true },
        },
      },
    });

    if (!member || member.role !== 'member') {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    // Calculate total spent
    const totalSpent = await this.prisma.order.aggregate({
      where: {
        memberId: id,
        status: 'confirmed',
      },
      _sum: { grandTotal: true },
    });

    return {
      ...member,
      totalSpent: totalSpent._sum.grandTotal || 0,
    };
  }
}
