import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { SimulatePaymentDto } from './dto/simulate-payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('simulate')
  @ApiOperation({ summary: 'Simulate a payment (QRIS/transfer/cash)' })
  simulate(@Body() dto: SimulatePaymentDto) {
    return this.paymentsService.simulate(dto);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get payments for an order' })
  findByOrder(@Param('orderId') orderId: string) {
    return this.paymentsService.findByOrder(orderId);
  }
}
