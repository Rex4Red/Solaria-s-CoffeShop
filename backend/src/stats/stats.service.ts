import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSales(range: 'daily' | 'weekly' | 'monthly') {
    const now = new Date();
    let startDate: Date;

    switch (range) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        throw new BadRequestException('Range must be daily, weekly, or monthly');
    }

    const [totalSales, orderCount, confirmedOrders, topItems] = await Promise.all([
      // Total revenue
      this.prisma.order.aggregate({
        where: { status: 'confirmed', createdAt: { gte: startDate } },
        _sum: { grandTotal: true },
        _count: true,
      }),
      // Order count by status
      this.prisma.order.groupBy({
        by: ['status'],
        where: { createdAt: { gte: startDate } },
        _count: true,
      }),
      // Average order value
      this.prisma.order.aggregate({
        where: { status: 'confirmed', createdAt: { gte: startDate } },
        _avg: { grandTotal: true },
      }),
      // Top selling items
      this.prisma.orderItem.groupBy({
        by: ['menuItemId'],
        where: {
          order: { status: 'confirmed', createdAt: { gte: startDate } },
        },
        _sum: { qty: true },
        orderBy: { _sum: { qty: 'desc' } },
        take: 10,
      }),
    ]);

    // Fetch menu item details for top items
    const topItemIds = topItems.map((i) => i.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: topItemIds } },
      select: { id: true, name: true, price: true, imageUrl: true },
    });

    const topSellingItems = topItems.map((item) => {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId);
      return {
        menuItem,
        totalQty: item._sum.qty,
      };
    });

    return {
      range,
      period: { start: startDate.toISOString(), end: now.toISOString() },
      revenue: {
        total: totalSales._sum.grandTotal || 0,
        orderCount: totalSales._count,
        averageOrderValue: confirmedOrders._avg.grandTotal || 0,
      },
      ordersByStatus: orderCount.map((o) => ({
        status: o.status,
        count: o._count,
      })),
      topSellingItems,
    };
  }

  async getDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todaySales, totalMembers, lowStockCount, waitingOrders] = await Promise.all([
      this.prisma.order.aggregate({
        where: { status: 'confirmed', createdAt: { gte: today } },
        _sum: { grandTotal: true },
        _count: true,
      }),
      this.prisma.profile.count({ where: { role: 'member' } }),
      this.prisma.menuItem.count({ where: { stock: { lte: 10 }, isAvailable: true } }),
      this.prisma.order.count({ where: { status: 'waiting' } }),
    ]);

    return {
      todayRevenue: todaySales._sum.grandTotal || 0,
      todayOrders: todaySales._count,
      totalMembers,
      lowStockItems: lowStockCount,
      waitingOrders,
    };
  }
}
