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
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/reminders')
@UseGuards(JwtGuard)
export class ReminderGlobalController {
  constructor(private reminderService: ReminderService) {}

  @Get()
  async list(@CurrentUser('sub') userId: string, @Query('status') status?: string) {
    const data = await this.reminderService.getAllReminders(userId, status);
    return { status: 'success', data };
  }

  @Patch(':id')
  async update(@CurrentUser('sub') userId: string, @Param('id') id: string, @Body() dto: any) {
    const reminder = await this.reminderService.updateReminder(userId, id, dto);
    return { status: 'success', data: reminder };
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    await this.reminderService.deleteReminder(userId, id);
  }
}
