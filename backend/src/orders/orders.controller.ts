import {
  Controller, Get, Post, Patch, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order (public — customer)' })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('kasir', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List orders (kasir/admin)' })
  @ApiQuery({ name: 'status', required: false, enum: ['waiting', 'confirmed', 'cancelled'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ordersService.findAll(status, Number(page) || 1, Number(limit) || 20);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('kasir', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order detail (kasir/admin)' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('kasir', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm an order (kasir/admin)' })
  confirm(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.ordersService.confirm(id, userId);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('kasir', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an order and restore stock (kasir/admin)' })
  cancel(@Param('id') id: string) {
    return this.ordersService.cancel(id);
  }
}
