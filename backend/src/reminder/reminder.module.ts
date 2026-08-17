import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';
import { ReminderGlobalController } from './reminder-global.controller';
import { ReminderSchedulerService } from './reminder-scheduler.service';
import { SupabaseModule } from '../config/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [ReminderGlobalController, ReminderController],
  providers: [ReminderService, ReminderSchedulerService],
  exports: [ReminderService],
})
export class ReminderModule {}
