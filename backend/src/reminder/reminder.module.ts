import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';
import { ReminderGlobalController } from './reminder-global.controller';
import { SupabaseModule } from '../config/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [ReminderGlobalController, ReminderController],
  providers: [ReminderService],
  exports: [ReminderService],
})
export class ReminderModule {}
