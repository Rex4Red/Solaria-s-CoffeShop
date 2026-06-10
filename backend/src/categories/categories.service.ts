import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: { select: { menuItems: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: dto,
      include: { _count: { select: { menuItems: true } } },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.prisma.category.update({
      where: { id },
      data: dto,
      include: { _count: { select: { menuItems: true } } },
    });
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Set menuItems categoryId to null before deleting
    await this.prisma.menuItem.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });

    await this.prisma.category.delete({ where: { id } });
    return { message: `Category "${category.name}" deleted successfully` };
  }
}
