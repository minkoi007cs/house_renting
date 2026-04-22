import {
  Controller,
  Post,
  Body,
  Headers,
  Get,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('verify')
  @HttpCode(200)
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

  @Get('profile')
  @UseGuards(JwtGuard)
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
