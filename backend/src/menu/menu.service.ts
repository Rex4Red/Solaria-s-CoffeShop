import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../common/services/storage.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async findAll(categoryId?: string) {
    return this.prisma.menuItem.findMany({
      where: {
        isAvailable: true,
        ...(categoryId && { categoryId }),
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findAllAdmin(categoryId?: string) {
    return this.prisma.menuItem.findMany({
      where: {
        ...(categoryId && { categoryId }),
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return item;
  }

  async create(dto: CreateMenuDto) {
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
      if (!category) {
        throw new BadRequestException(`Category with ID ${dto.categoryId} not found`);
      }
    }

    return this.prisma.menuItem.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        categoryId: dto.categoryId,
        stock: dto.stock ?? 0,
        isAvailable: dto.isAvailable ?? true,
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdateMenuDto) {
    await this.findOne(id);

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
      if (!category) {
        throw new BadRequestException(`Category with ID ${dto.categoryId} not found`);
      }
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: dto,
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async remove(id: string) {
    const item = await this.findOne(id);

    // Delete image from storage if exists
    if (item.imageUrl) {
      await this.storage.deleteMenuImage(item.imageUrl);
    }

    await this.prisma.menuItem.delete({ where: { id } });
    return { message: `Menu item "${item.name}" deleted successfully` };
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    const item = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    // Delete old image if exists
    if (item.imageUrl) {
      await this.storage.deleteMenuImage(item.imageUrl);
    }

    // Upload new image
    const imageUrl = await this.storage.uploadMenuImage(file);

    // Update database
    return this.prisma.menuItem.update({
      where: { id },
      data: { imageUrl },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });
  }
}
