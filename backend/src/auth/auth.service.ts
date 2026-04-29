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
    console.log(
      '[Auth] GOOGLE_CLIENT_ID loaded:',
      clientId ? clientId.slice(0, 20) + '...' : 'MISSING',
    );
    console.log(
      '[Auth] SUPABASE_URL:',
      this.configService.get<string>('SUPABASE_URL') || 'MISSING',
    );
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
    console.log('[Auth] verifyGoogleIdToken: start');
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        console.error('[Auth] verifyGoogleIdToken: payload is null');
        throw new UnauthorizedException('Invalid Google token');
      }

      console.log(
        '[Auth] verifyGoogleIdToken: success, email =',
        payload.email,
        '| sub =',
        payload.sub,
      );
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch (error) {
      console.error('[Auth] verifyGoogleIdToken: FAILED -', error);
      throw new UnauthorizedException('Google token verification failed');
    }
  }

  async createOrUpdateGoogleUser(googleUser: {
    id: string;
    email?: string;
    name?: string;
    picture?: string;
  }) {
    console.log('[Auth] createOrUpdateGoogleUser: start, email =', googleUser.email);
    try {
      if (!googleUser.email) {
        console.error('[Auth] createOrUpdateGoogleUser: no email');
        throw new UnauthorizedException('Google account must have email');
      }

      console.log('[Auth] createOrUpdateGoogleUser: checking existing user...');

      // Look up by google_sub first (most reliable), then fall back to email
      const { data: bySubUser } = await this.supabase
        .from('users')
        .select('*')
        .eq('google_sub', googleUser.id)
        .single();

      if (bySubUser) {
        console.log('[Auth] createOrUpdateGoogleUser: found by google_sub, id =', bySubUser.id);
        return bySubUser;
      }

      const { data: existingUser, error: selectError } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', googleUser.email)
        .single();

      if (selectError) {
        console.log(
          '[Auth] createOrUpdateGoogleUser: select error (likely no row) -',
          selectError.code,
          selectError.message,
        );
      }

      // Existing user found by email but missing google_sub — backfill it
      if (existingUser && !existingUser.google_sub) {
        console.log(
          '[Auth] createOrUpdateGoogleUser: backfilling google_sub for existing user, id =',
          existingUser.id,
        );
        await this.supabase
          .from('users')
          .update({ google_sub: googleUser.id })
          .eq('id', existingUser.id);
        return { ...existingUser, google_sub: googleUser.id };
      }

      if (!existingUser) {
        console.log('[Auth] createOrUpdateGoogleUser: user not found, inserting new user...');
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

        if (insertError) {
          console.error('[Auth] createOrUpdateGoogleUser: INSERT FAILED -', insertError);
          throw insertError;
        }

        console.log('[Auth] createOrUpdateGoogleUser: new user created, id =', newUser?.id);
        return newUser;
      }

      console.log('[Auth] createOrUpdateGoogleUser: existing user found, id =', existingUser.id);
      return existingUser;
    } catch (error) {
      console.error('[Auth] createOrUpdateGoogleUser: CAUGHT ERROR -', error);
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
