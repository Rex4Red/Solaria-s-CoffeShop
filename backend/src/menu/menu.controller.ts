import {
  Controller, Get, Post, Patch, Delete, Param, Query, Body,
  UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available menu items (public)' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
  findAll(@Query('categoryId') categoryId?: string) {
    return this.menuService.findAll(categoryId);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all menu items including unavailable (admin)' })
  @ApiQuery({ name: 'categoryId', required: false })
  findAllAdmin(@Query('categoryId') categoryId?: string) {
    return this.menuService.findAllAdmin(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single menu item by ID' })
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new menu item (admin)' })
  create(@Body() dto: CreateMenuDto) {
    return this.menuService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a menu item (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateMenuDto) {
    return this.menuService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a menu item (admin)' })
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }

  @Post(':id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload image for a menu item (admin)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary', description: 'Image file (JPG, PNG, WebP, max 5MB)' },
      },
    },
  })
  uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.menuService.uploadImage(id, file);
  }
}
