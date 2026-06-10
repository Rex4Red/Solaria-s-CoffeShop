import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('adjust')
  @ApiOperation({ summary: 'Adjust stock for a menu item (admin)' })
  adjust(@Body() dto: AdjustInventoryDto, @CurrentUser('id') userId: string) {
    return this.inventoryService.adjust(dto, userId);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get inventory adjustment logs (admin)' })
  @ApiQuery({ name: 'menuItemId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findLogs(
    @Query('menuItemId') menuItemId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.inventoryService.findLogs(menuItemId, Number(page) || 1, Number(limit) || 20);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get menu items with low stock (admin)' })
  @ApiQuery({ name: 'threshold', required: false, type: Number, description: 'Stock threshold (default: 10)' })
  getLowStock(@Query('threshold') threshold?: string) {
    return this.inventoryService.getLowStock(Number(threshold) || 10);
  }
}
