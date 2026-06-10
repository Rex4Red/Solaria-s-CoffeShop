import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as QRCode from 'qrcode';

@Injectable()
export class TablesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async findAll() {
    return this.prisma.table.findMany({
      where: { isActive: true },
      orderBy: { tableNumber: 'asc' },
    });
  }

  async verifyQrToken(qrToken: string) {
    const table = await this.prisma.table.findUnique({
      where: { qrToken },
    });

    if (!table) {
      throw new NotFoundException('Invalid QR code — table not found');
    }

    if (!table.isActive) {
      throw new NotFoundException('This table is currently inactive');
    }

    return {
      id: table.id,
      tableNumber: table.tableNumber,
      isActive: table.isActive,
    };
  }

  async generateQrCode(id: string, format: 'png' | 'svg' = 'png'): Promise<string | Buffer> {
    const table = await this.prisma.table.findUnique({
      where: { id },
    });

    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const orderUrl = `${frontendUrl}/order?table=${table.qrToken}`;

    if (format === 'svg') {
      return QRCode.toString(orderUrl, {
        type: 'svg',
        margin: 2,
        width: 400,
      });
    }

    return QRCode.toBuffer(orderUrl, {
      type: 'png',
      margin: 2,
      width: 400,
    });
  }

  async generateAllQrCodes(): Promise<Array<{ tableNumber: number; qrDataUrl: string }>> {
    const tables = await this.prisma.table.findMany({
      where: { isActive: true },
      orderBy: { tableNumber: 'asc' },
    });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');

    const qrCodes = await Promise.all(
      tables.map(async (table) => {
        const orderUrl = `${frontendUrl}/order?table=${table.qrToken}`;
        const dataUrl = await QRCode.toDataURL(orderUrl, {
          margin: 2,
          width: 400,
        });

        return {
          tableNumber: table.tableNumber,
          qrDataUrl: dataUrl,
        };
      }),
    );

    return qrCodes;
  }
}
