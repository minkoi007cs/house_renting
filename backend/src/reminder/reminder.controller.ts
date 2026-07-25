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
import { CreateReminderDto, UpdateReminderDto } from './dto/create-reminder.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { WorkspaceOwnerId } from '../common/decorators/workspace-owner.decorator';

@Controller('api/properties/:propertyId/reminders')
@UseGuards(JwtGuard)
export class ReminderController {
  constructor(private reminderService: ReminderService) {}

  @Get()
  async getReminders(@WorkspaceOwnerId() userId: string, @Param('propertyId') propertyId: string) {
    const reminders = await this.reminderService.getRemindersByProperty(userId, propertyId);
    return { status: 'success', data: reminders };
  }

  @Post('defaults')
  async createDefaultReminders(
    @WorkspaceOwnerId() userId: string,
    @Param('propertyId') propertyId: string,
  ) {
    const reminders = await this.reminderService.createDefaultReminders(userId, propertyId);
    return { status: 'success', data: reminders };
  }

  @Post()
  async createReminder(
    @WorkspaceOwnerId() userId: string,
    @Param('propertyId') propertyId: string,
    @Body() dto: CreateReminderDto,
  ) {
    const reminder = await this.reminderService.createReminder(userId, propertyId, dto);
    return { status: 'success', data: reminder };
  }

  @Get(':id')
  async getReminderDetail(@WorkspaceOwnerId() userId: string, @Param('id') reminderId: string) {
    const reminder = await this.reminderService.getReminderById(userId, reminderId);
    return { status: 'success', data: reminder };
  }

  @Patch(':id')
  async updateReminder(
    @WorkspaceOwnerId() userId: string,
    @Param('id') reminderId: string,
    @Body() dto: UpdateReminderDto,
  ) {
    const reminder = await this.reminderService.updateReminder(userId, reminderId, dto);
    return { status: 'success', data: reminder };
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteReminder(@WorkspaceOwnerId() userId: string, @Param('id') reminderId: string) {
    await this.reminderService.deleteReminder(userId, reminderId);
  }
}
