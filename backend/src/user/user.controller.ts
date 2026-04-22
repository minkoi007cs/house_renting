import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('api/users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile(@CurrentUser('sub') userId: string) {
    const profile = await this.userService.getUserProfile(userId);
    return {
      status: 'success',
      data: profile,
    };
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() data: any,
  ) {
    const updated = await this.userService.updateUserProfile(userId, data);
    return {
      status: 'success',
      data: updated,
    };
  }
}
