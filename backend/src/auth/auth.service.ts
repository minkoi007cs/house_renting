import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
  ) {}

  async verifySupabaseToken(token: string) {
    try {
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser(token);

      if (error || !user) {
        throw new UnauthorizedException('Invalid Supabase token');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }

  async createOrUpdateUser(supabaseUser: any) {
    try {
      const { data: existingUser } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (!existingUser) {
        const { data: newUser, error } = await this.supabase
          .from('users')
          .insert([
            {
              id: supabaseUser.id,
              email: supabaseUser.email,
              name: supabaseUser.user_metadata?.full_name || '',
              avatar_url: supabaseUser.user_metadata?.avatar_url || null,
            },
          ])
          .select()
          .single();

        if (error) throw error;
        return newUser;
      }

      return existingUser;
    } catch (error) {
      throw new ConflictException('Failed to create or update user');
    }
  }

  generateJWT(userId: string): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    const expiresIn = this.configService.get<number>('JWT_EXPIRATION') || 86400;

    return jwt.sign(
      {
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
      },
      secret,
      {
        expiresIn,
      },
    );
  }

  verifyJWT(token: string) {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      return jwt.verify(token, secret);
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }
}
