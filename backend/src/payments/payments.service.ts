import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SimulatePaymentDto } from './dto/simulate-payment.dto';
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async simulate(dto: SimulatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { payments: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${dto.orderId} not found`);
    }

    const existingPaid = order.payments.find((p) => p.status === 'paid');
    if (existingPaid) {
      throw new BadRequestException('This order has already been paid');
    }

    const payment = await this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        method: dto.method as PaymentMethod,
        amount: order.grandTotal,
        status: 'paid',
      },
      include: {
        order: {
          select: {
            id: true,
            status: true,
            grandTotal: true,
            table: { select: { tableNumber: true } },
          },
        },
      },
    });

    return { message: `Payment simulated successfully via ${dto.method}`, payment };
  }

  async findByOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return this.prisma.payment.findMany({
      where: { orderId },
      include: {
        order: {
          select: { id: true, status: true, grandTotal: true, table: { select: { tableNumber: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
