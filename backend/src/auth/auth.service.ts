import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { createHash, randomBytes } from 'crypto';

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
        .from('hr_users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (!existingUser) {
        const { data: newUser, error } = await this.supabase
          .from('hr_users')
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
      console.error('[AuthService] createOrUpdateUser FAILED:', error);
      throw new ConflictException('Failed to create or update user');
    }
  }

  generateJWT(userId: string): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) throw new Error('JWT_SECRET environment variable is not configured');
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
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) throw new Error('JWT_SECRET environment variable is not configured');
    try {
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
        .from('hr_users')
        .select('*')
        .eq('google_sub', googleUser.id)
        .single();

      if (bySubUser) return bySubUser;

      const { data: existingUser } = await this.supabase
        .from('hr_users')
        .select('*')
        .eq('email', googleUser.email)
        .single();

      // Existing user found by email but missing google_sub — backfill it
      if (existingUser && !existingUser.google_sub) {
        await this.supabase
          .from('hr_users')
          .update({ google_sub: googleUser.id })
          .eq('id', existingUser.id);
        return { ...existingUser, google_sub: googleUser.id };
      }

      if (!existingUser) {
        const { data: newUser, error: insertError } = await this.supabase
          .from('hr_users')
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
      console.error('[AuthService] createOrUpdateGoogleUser FAILED:', error);
      throw new ConflictException('Failed to create or update user');
    }
  }

  async getUserById(userId: string) {
    const { data, error } = await this.supabase
      .from('hr_users')
      .select('id, email, name, avatar_url, created_at')
      .eq('id', userId)
      .single();
    if (error || !data) throw new UnauthorizedException('User not found');
    return data;
  }

  getAccessExpiresIn(): number {
    return parseInt(this.configService.get<string>('JWT_EXPIRATION') || '1800', 10);
  }

  private hashToken(raw: string): string {
    return createHash('sha256').update(raw).digest('hex');
  }

  private getRefreshExpirationDays(): number {
    return parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION_DAYS') || '30', 10);
  }

  async generateRefreshToken(userId: string): Promise<{ token: string; expiresAt: Date }> {
    const raw = randomBytes(40).toString('hex');
    const tokenHash = this.hashToken(raw);
    const days = this.getRefreshExpirationDays();
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const { error } = await this.supabase
      .from('hr_refresh_tokens')
      .insert([{ user_id: userId, token_hash: tokenHash, expires_at: expiresAt.toISOString() }]);

    if (error) throw error;
    return { token: raw, expiresAt };
  }

  async verifyAndRotateRefreshToken(rawToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresAt: Date;
  }> {
    const tokenHash = this.hashToken(rawToken);

    const { data: record, error } = await this.supabase
      .from('hr_refresh_tokens')
      .select('id, user_id, expires_at, revoked_at')
      .eq('token_hash', tokenHash)
      .single();

    if (error || !record) throw new UnauthorizedException('Invalid refresh token');
    if (record.revoked_at) throw new UnauthorizedException('Refresh token has been revoked');
    if (new Date(record.expires_at) < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Revoke the used token (rotation)
    await this.supabase
      .from('hr_refresh_tokens')
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', record.id);

    const accessToken = this.generateJWT(record.user_id);
    const { token: newRefreshToken, expiresAt: refreshExpiresAt } = await this.generateRefreshToken(
      record.user_id,
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: this.getAccessExpiresIn(),
      refreshExpiresAt,
    };
  }

  async revokeRefreshToken(rawToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawToken);

    const { data: record } = await this.supabase
      .from('hr_refresh_tokens')
      .select('id, revoked_at')
      .eq('token_hash', tokenHash)
      .single();

    if (!record || record.revoked_at) return; // already revoked or not found — no-op

    await this.supabase
      .from('hr_refresh_tokens')
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', record.id);
  }
}
