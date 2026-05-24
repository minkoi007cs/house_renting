import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const url = request.url;
    const method = request.method;

    console.log(`[JwtGuard] ${method} ${url}`);

    if (!authHeader) {
      console.error('[JwtGuard] FAILED - Missing authorization header');
      throw new UnauthorizedException('Missing authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.error('[JwtGuard] FAILED - Invalid authorization header format');
      throw new UnauthorizedException('Invalid authorization header');
    }

    let decoded: any;
    try {
      const secret = this.configService.get<string>('JWT_SECRET') || 'default-secret';
      decoded = jwt.verify(token, secret) as any;
      request.user = decoded;
      console.log(
        `[JwtGuard] OK - userId=${decoded.sub}, exp=${new Date(decoded.exp * 1000).toISOString()}`,
      );
    } catch (error) {
      console.error('[JwtGuard] FAILED - Token error:', (error as Error).message);
      throw new UnauthorizedException('Invalid or expired token');
    }

    const userId = decoded.sub;
    
    // Set default workspace context (the user's own workspace)
    request.workspaceOwnerId = userId;
    request.workspacePermission = 'owner';

    // Check if switching workspace is requested via header
    const workspaceOwnerHeader = request.headers['x-workspace-owner-id'];
    
    // Skip workspace switching for user settings and invitations routes
    const isUserSettingsOrInvitationsRoute = url.startsWith('/api/users');

    if (workspaceOwnerHeader && workspaceOwnerHeader !== userId && !isUserSettingsOrInvitationsRoute) {
      console.log(`[JwtGuard] Switching requested to workspace owner: ${workspaceOwnerHeader}`);

      // 1. Get logged-in user's email from database
      const { data: userData, error: userError } = await this.supabase
        .from('hr_users')
        .select('email')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        console.error('[JwtGuard] FAILED - Could not fetch active user details:', userError);
        throw new ForbiddenException('User session details invalid');
      }

      // 2. Verify that there is an accepted invitation between workspaceOwnerHeader and user's email
      const { data: inviteData, error: inviteError } = await this.supabase
        .from('hr_workspace_invitations')
        .select('role')
        .eq('inviter_id', workspaceOwnerHeader)
        .eq('invitee_email', userData.email)
        .eq('status', 'accepted')
        .single();

      if (inviteError || !inviteData) {
        console.error('[JwtGuard] FAILED - No accepted invitation found between', workspaceOwnerHeader, 'and', userData.email);
        throw new ForbiddenException('You do not have access to this workspace');
      }

      console.log(`[JwtGuard] SWITCH OK - Switched to workspace: ${workspaceOwnerHeader} | Permission: ${inviteData.role}`);
      request.workspaceOwnerId = workspaceOwnerHeader;
      request.workspacePermission = inviteData.role;

      // 3. Enforce read-only permission for 'viewer' role on write operations
      const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
      if (inviteData.role === 'viewer' && isWriteOperation) {
        console.error(`[JwtGuard] FAILED - Viewer attempted write operation (${method}) on workspace of: ${workspaceOwnerHeader}`);
        throw new ForbiddenException('You only have read-only access to this workspace');
      }
    }

    return true;
  }
}
