import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/properties/:propertyId/reminders')
@UseGuards(JwtGuard)
export class ReminderController {
  constructor(private reminderService: ReminderService) {}

  @Get()
  async getReminders(@CurrentUser('sub') userId: string, @Param('propertyId') propertyId: string) {
    const reminders = await this.reminderService.getRemindersByProperty(userId, propertyId);
    return { status: 'success', data: reminders };
  }

  @Post('defaults')
  async createDefaultReminders(
    @CurrentUser('sub') userId: string,
    @Param('propertyId') propertyId: string,
  ) {
    const reminders = await this.reminderService.createDefaultReminders(userId, propertyId);
    return { status: 'success', data: reminders };
  }

  @Post()
  async createReminder(
    @CurrentUser('sub') userId: string,
    @Param('propertyId') propertyId: string,
    @Body() dto: any,
  ) {
    const reminder = await this.reminderService.createReminder(userId, propertyId, dto);
    return { status: 'success', data: reminder };
  }

  @Get(':id')
  async getReminderDetail(@CurrentUser('sub') userId: string, @Param('id') reminderId: string) {
    const reminder = await this.reminderService.getReminderById(userId, reminderId);
    return { status: 'success', data: reminder };
  }

  @Patch(':id')
  async updateReminder(
    @CurrentUser('sub') userId: string,
    @Param('id') reminderId: string,
    @Body() dto: any,
  ) {
    const reminder = await this.reminderService.updateReminder(userId, reminderId, dto);
    return { status: 'success', data: reminder };
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteReminder(@CurrentUser('sub') userId: string, @Param('id') reminderId: string) {
    await this.reminderService.deleteReminder(userId, reminderId);
  }
}
