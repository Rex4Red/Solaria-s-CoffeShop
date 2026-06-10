import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import * as path from 'path';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;
  private readonly bucketName = 'menu-images';

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }

  async uploadMenuImage(file: Express.Multer.File): Promise<string> {
    // Validate file type
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Allowed: ${allowedMimes.join(', ')}`,
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    // Generate unique filename
    const ext = path.extname(file.originalname) || '.jpg';
    const fileName = `${randomUUID()}${ext}`;
    const filePath = `menu/${fileName}`;

    // Upload to Supabase Storage
    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async deleteMenuImage(imageUrl: string): Promise<void> {
    // Extract file path from URL
    const bucketPath = imageUrl.split(`${this.bucketName}/`)[1];
    if (!bucketPath) return;

    await this.supabase.storage
      .from(this.bucketName)
      .remove([bucketPath]);
  }
}
