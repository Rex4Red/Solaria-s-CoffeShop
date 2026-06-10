import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';
import { TablesService } from './tables.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Tables')
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active tables' })
  findAll() {
    return this.tablesService.findAll();
  }

  @Get('verify/:qrToken')
  @ApiOperation({ summary: 'Verify QR token and get table info' })
  verify(@Param('qrToken') qrToken: string) {
    return this.tablesService.verifyQrToken(qrToken);
  }

  @Get('qr/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get QR codes for all tables (admin only)' })
  getAllQrCodes() {
    return this.tablesService.generateAllQrCodes();
  }

  @Get(':id/qr')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate QR code for a specific table (admin only)' })
  @ApiQuery({ name: 'format', required: false, enum: ['png', 'svg'] })
  async getQrCode(
    @Param('id') id: string,
    @Query('format') format: 'png' | 'svg' = 'png',
    @Res() res: Response,
  ) {
    const qrCode = await this.tablesService.generateQrCode(id, format);

    if (format === 'svg') {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(qrCode);
    } else {
      res.setHeader('Content-Type', 'image/png');
      res.send(qrCode);
    }
  }
}
