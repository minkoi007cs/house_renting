import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

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
  async updateProfile(@CurrentUser('sub') userId: string, @Body() data: any) {
    const updated = await this.userService.updateUserProfile(userId, data);
    return {
      status: 'success',
      data: updated,
    };
  }

  @Post('invitations/invite')
  async inviteUser(
    @CurrentUser('sub') userId: string,
    @Body('email') email: string,
    @Body('role') role: 'viewer' | 'editor',
  ) {
    const invite = await this.userService.inviteUser(userId, email, role);
    return {
      status: 'success',
      data: invite,
    };
  }

  @Get('invitations/sent')
  async getSentInvitations(@CurrentUser('sub') userId: string) {
    const invites = await this.userService.getSentInvitations(userId);
    return {
      status: 'success',
      data: invites,
    };
  }

  @Get('invitations/received')
  async getReceivedInvitations(@CurrentUser('sub') userId: string) {
    const invites = await this.userService.getReceivedInvitations(userId);
    return {
      status: 'success',
      data: invites,
    };
  }

  @Post('invitations/:id/accept')
  async acceptInvitation(@CurrentUser('sub') userId: string, @Param('id') inviteId: string) {
    const invite = await this.userService.acceptInvitation(userId, inviteId);
    return {
      status: 'success',
      data: invite,
    };
  }

  @Post('invitations/:id/reject')
  async rejectInvitation(@CurrentUser('sub') userId: string, @Param('id') inviteId: string) {
    const invite = await this.userService.rejectInvitation(userId, inviteId);
    return {
      status: 'success',
      data: invite,
    };
  }

  @Delete('invitations/:id')
  async deleteInvitation(@CurrentUser('sub') userId: string, @Param('id') inviteId: string) {
    const result = await this.userService.deleteInvitation(userId, inviteId);
    return {
      status: 'success',
      data: result,
    };
  }
}
