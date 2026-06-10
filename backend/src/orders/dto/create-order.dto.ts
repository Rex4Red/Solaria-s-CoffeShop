import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ example: 'uuid-menu-item-id' })
  @IsString()
  @IsNotEmpty()
  menuItemId!: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  qty!: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'uuid-table-id-or-qr-token' })
  @IsString()
  @IsNotEmpty()
  tableToken!: string;

  @ApiPropertyOptional({ description: 'Member profile ID (if logged in)' })
  @IsOptional()
  @IsString()
  memberId?: string;

  @ApiPropertyOptional({ example: 'Tanpa gula, extra shot' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
