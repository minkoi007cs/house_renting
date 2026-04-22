import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PropertyModule } from './property/property.module';
import { UnitModule } from './unit/unit.module';
import { TenantModule } from './tenant/tenant.module';
import { ContractModule } from './contract/contract.module';
import { TransactionModule } from './transaction/transaction.module';
import { MediaModule } from './media/media.module';
import { ReminderModule } from './reminder/reminder.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SupabaseModule } from './config/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SupabaseModule,
    AuthModule,
    UserModule,
    PropertyModule,
    UnitModule,
    TenantModule,
    ContractModule,
    TransactionModule,
    MediaModule,
    ReminderModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
