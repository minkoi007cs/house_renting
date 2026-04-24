import {
  Controller,
  Post,
  Body,
  Headers,
  Get,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('verify')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify Supabase token and get JWT' })
  @ApiResponse({ status: 200, description: 'Token verified, JWT returned' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async verifyToken(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.split(' ')[1];
    const supabaseUser = await this.authService.verifySupabaseToken(token);
    const user = await this.authService.createOrUpdateUser(supabaseUser);
    const jwtToken = this.authService.generateJWT(user.id);

    return {
      status: 'success',
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        token: jwtToken,
      },
    };
  }

  @Post('google')
  @HttpCode(200)
  @ApiOperation({ summary: 'Google OAuth authentication' })
  @ApiBody({ schema: { type: 'object', properties: { idToken: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Google login successful, JWT returned' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  async googleAuth(@Body() body: { idToken: string }) {
    if (!body.idToken) {
      throw new Error('Missing Google ID token');
    }

    const googleUser = await this.authService.verifyGoogleIdToken(
      body.idToken,
    );
    const user = await this.authService.createOrUpdateGoogleUser(googleUser);
    const jwtToken = this.authService.generateJWT(user.id);

    return {
      status: 'success',
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        token: jwtToken,
      },
    };
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({ status: 200, description: 'User profile returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser('sub') userId: string) {
    // TODO: Implement get user profile from database
    return {
      status: 'success',
      data: {
        userId,
      },
    };
  }
}
