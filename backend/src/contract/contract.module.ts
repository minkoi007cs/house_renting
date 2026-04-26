import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { ContractGlobalController } from './contract-global.controller';
import { SupabaseModule } from '../config/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [ContractService],
  controllers: [ContractGlobalController, ContractController],
  exports: [ContractService],
})
export class ContractModule {}
