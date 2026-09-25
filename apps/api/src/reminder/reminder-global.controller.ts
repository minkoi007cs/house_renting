import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { WorkspaceOwnerId } from '../common/decorators/workspace-owner.decorator';

@Controller('api/reminders')
@UseGuards(JwtGuard)
export class ReminderGlobalController {
  constructor(private reminderService: ReminderService) {}

  @Get()
  async list(@WorkspaceOwnerId() userId: string, @Query('status') status?: string) {
    const data = await this.reminderService.getAllReminders(userId, status);
    return { status: 'success', data };
  }

  @Patch(':id')
  async update(@WorkspaceOwnerId() userId: string, @Param('id') id: string, @Body() dto: any) {
    const reminder = await this.reminderService.updateReminder(userId, id, dto);
    return { status: 'success', data: reminder };
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@WorkspaceOwnerId() userId: string, @Param('id') id: string) {
    await this.reminderService.deleteReminder(userId, id);
  }
}
