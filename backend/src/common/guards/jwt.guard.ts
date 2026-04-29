import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
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

    try {
      const secret = this.configService.get<string>('JWT_SECRET') || 'default-secret';
      const decoded = jwt.verify(token, secret) as any;
      request.user = decoded;
      console.log(
        `[JwtGuard] OK - userId=${decoded.sub}, exp=${new Date(decoded.exp * 1000).toISOString()}`,
      );
      return true;
    } catch (error) {
      console.error('[JwtGuard] FAILED - Token error:', (error as Error).message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
