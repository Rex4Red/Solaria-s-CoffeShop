import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDiscountDto {
  @ApiProperty({ example: 'Promo Weekend' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'percentage', description: 'percentage or fixed' })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty({ example: 20, description: 'Discount value (percentage or fixed amount)' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  value!: number;

  @ApiProperty({ example: '2026-06-10T00:00:00Z' })
  @IsDateString()
  startAt!: string;

  @ApiProperty({ example: '2026-06-17T23:59:59Z' })
  @IsDateString()
  endAt!: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Apply to all menu items' })
  @IsOptional()
  @IsBoolean()
  appliesToAll?: boolean;

  @ApiPropertyOptional({ example: ['uuid-menu-1', 'uuid-menu-2'], description: 'Menu item IDs if not appliesToAll' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  menuItemIds?: string[];
}
