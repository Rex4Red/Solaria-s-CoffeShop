import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AdjustInventoryDto {
  @ApiProperty({ example: 'uuid-menu-item-id' })
  @IsString()
  @IsNotEmpty()
  menuItemId!: string;

  @ApiProperty({ example: 10, description: 'Positive to add, negative to subtract' })
  @IsNumber()
  @Type(() => Number)
  changeQty!: number;

  @ApiPropertyOptional({ example: 'Restok bahan baku' })
  @IsOptional()
  @IsString()
  reason?: string;
}
