import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TenantGlobalController } from './tenant-global.controller';
import { SupabaseModule } from '../config/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [TenantService],
  controllers: [TenantGlobalController, TenantController],
  exports: [TenantService],
})
export class TenantModule {}
