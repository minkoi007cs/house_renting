import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionGlobalController } from './transaction-global.controller';
import { SupabaseModule } from '../config/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [TransactionGlobalController, TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
