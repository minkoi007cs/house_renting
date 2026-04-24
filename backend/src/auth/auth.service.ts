import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private configService: ConfigService,
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
  ) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.googleClient = new OAuth2Client(clientId);
  }

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
    const secret = this.configService.get<string>('JWT_SECRET') || 'default-secret';
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
      const secret = this.configService.get<string>('JWT_SECRET') || 'default-secret';
      return jwt.verify(token, secret);
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }

  async verifyGoogleIdToken(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch (error) {
      throw new UnauthorizedException('Google token verification failed');
    }
  }

  async createOrUpdateGoogleUser(googleUser: {
    id: string;
    email?: string;
    name?: string;
    picture?: string;
  }) {
    try {
      if (!googleUser.email) {
        throw new UnauthorizedException('Google account must have email');
      }

      const { data: existingUser } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', googleUser.email)
        .single();

      if (!existingUser) {
        const { data: newUser, error } = await this.supabase
          .from('users')
          .insert([
            {
              id: googleUser.id,
              email: googleUser.email,
              name: googleUser.name || '',
              avatar_url: googleUser.picture || null,
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
}
