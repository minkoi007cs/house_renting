import {
  Controller,
  Post,
  Body,
  Headers,
  Get,
  UseGuards,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('verify')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify Supabase token and get JWT' })
  @ApiResponse({ status: 200, description: 'Token verified, JWT returned' })
  @ApiResponse({ status: 400, description: 'Missing authorization header' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async verifyToken(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new BadRequestException('Missing authorization header');
    }

    const token = authHeader.split(' ')[1];
    const supabaseUser = await this.authService.verifySupabaseToken(token);
    const user = await this.authService.createOrUpdateUser(supabaseUser);
    const accessToken = this.authService.generateJWT(user.id);
    const { token: refreshToken, expiresAt: refreshExpiresAt } =
      await this.authService.generateRefreshToken(user.id);

    return {
      status: 'success',
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        token: accessToken,
        accessToken,
        refreshToken,
        expiresIn: this.authService.getAccessExpiresIn(),
        refreshExpiresAt: refreshExpiresAt.toISOString(),
      },
    };
  }

  @Post('google')
  @HttpCode(200)
  @ApiOperation({ summary: 'Google OAuth authentication' })
  @ApiBody({ schema: { type: 'object', properties: { idToken: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Google login successful, JWT returned' })
  @ApiResponse({ status: 400, description: 'Missing Google ID token' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  async googleAuth(@Body() body: { idToken: string }) {
    if (!body.idToken) {
      throw new BadRequestException('Missing Google ID token');
    }

    const googleUser = await this.authService.verifyGoogleIdToken(body.idToken);
    const user = await this.authService.createOrUpdateGoogleUser(googleUser);
    const accessToken = this.authService.generateJWT(user.id);
    const { token: refreshToken, expiresAt: refreshExpiresAt } =
      await this.authService.generateRefreshToken(user.id);

    return {
      status: 'success',
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        token: accessToken,
        accessToken,
        refreshToken,
        expiresIn: this.authService.getAccessExpiresIn(),
        refreshExpiresAt: refreshExpiresAt.toISOString(),
      },
    };
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Rotate refresh token and get new access token' })
  @ApiResponse({ status: 200, description: 'New tokens issued' })
  @ApiResponse({ status: 401, description: 'Invalid, expired, or revoked refresh token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    const result = await this.authService.verifyAndRotateRefreshToken(dto.refreshToken);
    return {
      status: 'success',
      data: {
        token: result.accessToken,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
        refreshExpiresAt: result.refreshExpiresAt.toISOString(),
      },
    };
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Revoke refresh token (logout)' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Body() dto: RefreshTokenDto) {
    await this.authService.revokeRefreshToken(dto.refreshToken);
    return { status: 'success', data: { message: 'Logged out successfully' } };
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({ status: 200, description: 'User profile returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser('sub') userId: string) {
    const user = await this.authService.getUserById(userId);
    return { status: 'success', data: user };
  }
}
