import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Stats')
@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('sales')
  @ApiOperation({ summary: 'Get sales statistics (admin)' })
  @ApiQuery({ name: 'range', enum: ['daily', 'weekly', 'monthly'], required: true })
  getSales(@Query('range') range: 'daily' | 'weekly' | 'monthly') {
    return this.statsService.getSales(range);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard summary (admin)' })
  getDashboard() {
    return this.statsService.getDashboard();
  }
}
