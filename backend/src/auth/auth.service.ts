import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
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
    const expiresIn = parseInt(this.configService.get<string>('JWT_EXPIRATION') || '2592000', 10);

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

      // Look up by google_sub first (most reliable), then fall back to email
      const { data: bySubUser } = await this.supabase
        .from('users')
        .select('*')
        .eq('google_sub', googleUser.id)
        .single();

      if (bySubUser) return bySubUser;

      const { data: existingUser } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', googleUser.email)
        .single();

      // Existing user found by email but missing google_sub — backfill it
      if (existingUser && !existingUser.google_sub) {
        await this.supabase
          .from('users')
          .update({ google_sub: googleUser.id })
          .eq('id', existingUser.id);
        return { ...existingUser, google_sub: googleUser.id };
      }

      if (!existingUser) {
        const { data: newUser, error: insertError } = await this.supabase
          .from('users')
          .insert([
            {
              email: googleUser.email,
              name: googleUser.name || '',
              avatar_url: googleUser.picture || null,
              google_sub: googleUser.id,
            },
          ])
          .select()
          .single();

        if (insertError) throw insertError;
        return newUser;
      }

      return existingUser;
    } catch (error) {
      throw new ConflictException('Failed to create or update user');
    }
  }

  async getUserById(userId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, email, name, avatar_url, created_at')
      .eq('id', userId)
      .single();
    if (error || !data) throw new UnauthorizedException('User not found');
    return data;
  }
}
