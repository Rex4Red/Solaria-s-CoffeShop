import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SimulatePaymentDto {
  @ApiProperty({ example: 'uuid-order-id' })
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @ApiProperty({ enum: ['qris', 'transfer_bank', 'cash'], example: 'qris' })
  @IsEnum(['qris', 'transfer_bank', 'cash'])
  method!: 'qris' | 'transfer_bank' | 'cash';
}
