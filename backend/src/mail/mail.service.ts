import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export interface ReminderMailPayload {
  to: string;
  ownerName: string;
  reminderTitle: string;
  propertyName: string;
  dueDate: string;
  description?: string;
  daysUntilDue: number;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private configService: ConfigService) {
    const user = this.configService.get<string>('GMAIL_USER');
    const pass = this.configService.get<string>('GMAIL_APP_PASSWORD');

    if (!user || !pass) {
      this.logger.warn('GMAIL_USER or GMAIL_APP_PASSWORD not set — email notifications disabled');
      return;
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  isEnabled(): boolean {
    return this.transporter !== null;
  }

  private formatUsDate(isoDate: string): string {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/New_York',
    }).format(new Date(`${isoDate}T12:00:00`));
  }

  async sendReminderNotification(payload: ReminderMailPayload): Promise<void> {
    if (!this.transporter) return;

    const urgencyLabel = payload.daysUntilDue === 0 ? '🔴 Due TODAY' : `🟡 Due Tomorrow`;

    const html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
        <h2 style="margin-top:0;color:#1f2937;">📋 Reminder: ${payload.reminderTitle}</h2>
        <p style="font-size:16px;color:#374151;">Hi ${payload.ownerName},</p>
        <p style="color:#374151;">You have an upcoming reminder for your property:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr>
            <td style="padding:8px 12px;background:#f3f4f6;font-weight:600;border-radius:4px 0 0 4px;color:#374151;width:140px;">Property</td>
            <td style="padding:8px 12px;background:#f9fafb;border-radius:0 4px 4px 0;color:#1f2937;">${payload.propertyName}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f3f4f6;font-weight:600;border-radius:4px 0 0 4px;color:#374151;">Due date</td>
            <td style="padding:8px 12px;background:#f9fafb;border-radius:0 4px 4px 0;color:#1f2937;">${this.formatUsDate(payload.dueDate)}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f3f4f6;font-weight:600;border-radius:4px 0 0 4px;color:#374151;">Status</td>
            <td style="padding:8px 12px;background:#f9fafb;border-radius:0 4px 4px 0;color:#1f2937;">${urgencyLabel}</td>
          </tr>
          ${
            payload.description
              ? `<tr>
            <td style="padding:8px 12px;background:#f3f4f6;font-weight:600;border-radius:4px 0 0 4px;color:#374151;">Note</td>
            <td style="padding:8px 12px;background:#f9fafb;border-radius:0 4px 4px 0;color:#1f2937;">${payload.description}</td>
          </tr>`
              : ''
          }
        </table>
        <p style="color:#6b7280;font-size:13px;margin-top:24px;">This is an automated notification from your Renthub property manager.</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"Renthub" <${this.configService.get('GMAIL_USER')}>`,
      to: payload.to,
      subject: `[Renthub] ${urgencyLabel} — ${payload.reminderTitle} (${payload.propertyName})`,
      html,
    });
  }
}
