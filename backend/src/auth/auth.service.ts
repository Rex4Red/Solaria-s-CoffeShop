import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.supabase = createClient(
      this.configService.getOrThrow<string>('SUPABASE_URL'),
      this.configService.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  async register(dto: RegisterDto) {
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } =
      await this.supabase.auth.admin.createUser({
        email: dto.email,
        password: dto.password,
        email_confirm: true, // Auto-confirm for development
      });

    if (authError) {
      throw new ConflictException(authError.message);
    }

    // 2. Create profile in our database
    const profile = await this.prisma.profile.create({
      data: {
        authUserId: authData.user.id,
        name: dto.name,
        phone: dto.phone,
        role: 'member', // Default role
      },
    });

    // 3. Sign in to get tokens
    const { data: signInData, error: signInError } =
      await this.supabase.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (signInError) {
      throw new UnauthorizedException('Registration succeeded but login failed');
    }

    return {
      user: {
        id: profile.id,
        email: dto.email,
        name: profile.name,
        role: profile.role,
      },
      session: {
        access_token: signInData.session?.access_token,
        refresh_token: signInData.session?.refresh_token,
        expires_at: signInData.session?.expires_at,
      },
    };
  }

  async login(dto: LoginDto) {
    // 1. Sign in with Supabase Auth
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Get profile
    const profile = await this.prisma.profile.findUnique({
      where: { authUserId: data.user.id },
    });

    if (!profile) {
      throw new UnauthorizedException('Profile not found. Please register first.');
    }

    return {
      user: {
        id: profile.id,
        email: data.user.email,
        name: profile.name,
        role: profile.role,
        points: profile.points,
      },
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at,
      },
    };
  }

  async getProfile(authUserId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { authUserId },
    });

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      name: profile.name,
      role: profile.role,
      phone: profile.phone,
      points: profile.points,
      createdAt: profile.createdAt,
    };
  }
}
