import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SupabaseClient } from '@supabase/supabase-js';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ReminderSchedulerService {
  private readonly logger = new Logger(ReminderSchedulerService.name);

  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
    private mailService: MailService,
  ) {}

  // Runs every day at 08:00 Eastern Time (Ohio)
  @Cron('0 8 * * *', { timeZone: 'America/New_York' })
  async sendDueReminderEmails(): Promise<void> {
    if (!this.mailService.isEnabled()) {
      this.logger.warn('Mail not configured — skipping reminder notifications');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split('T')[0];

    this.logger.log(`[ReminderScheduler] Checking reminders for ${today} and ${tomorrow}`);

    // 1. Fetch pending reminders due today or tomorrow that haven't been notified yet
    const { data: reminders, error } = await this.supabase
      .from('hr_reminders')
      .select(
        `id, title, description, due_date,
         property:hr_properties!inner(id, name, user_id)`,
      )
      .in('due_date', [today, tomorrow])
      .eq('status', 'pending')
      .is('notified_at', null)
      .is('deleted_at', null);

    if (error) {
      this.logger.error('[ReminderScheduler] Failed to fetch reminders', error);
      return;
    }

    if (!reminders || reminders.length === 0) {
      this.logger.log('[ReminderScheduler] No pending notifications');
      return;
    }

    // 2. Collect unique owner IDs and fetch their emails in one query
    const ownerIds = [...new Set(reminders.map((r: any) => r.property.user_id))];
    const { data: owners } = await this.supabase
      .from('hr_users')
      .select('id, email, name')
      .in('id', ownerIds);

    const ownerMap = new Map((owners || []).map((u: any) => [u.id, u]));

    // 3. Send emails and mark as notified
    let sent = 0;
    let failed = 0;

    for (const reminder of reminders as any[]) {
      const owner = ownerMap.get(reminder.property.user_id);
      if (!owner?.email) continue;

      const daysUntilDue = reminder.due_date === today ? 0 : 1;

      try {
        await this.mailService.sendReminderNotification({
          to: owner.email,
          ownerName: owner.name || owner.email,
          reminderTitle: reminder.title,
          propertyName: reminder.property.name,
          dueDate: reminder.due_date,
          description: reminder.description,
          daysUntilDue,
        });

        await this.supabase
          .from('hr_reminders')
          .update({ notified_at: new Date().toISOString() })
          .eq('id', reminder.id);

        sent++;
        this.logger.log(`[ReminderScheduler] Sent: "${reminder.title}" → ${owner.email}`);
      } catch (err) {
        failed++;
        this.logger.error(
          `[ReminderScheduler] Failed to send "${reminder.title}" → ${owner.email}`,
          err,
        );
        // notified_at stays null → will retry next day's cron
      }
    }

    this.logger.log(`[ReminderScheduler] Done — sent: ${sent}, failed: ${failed}`);
  }
}
