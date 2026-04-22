import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Global()
@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('SUPABASE_URL');
        const key = configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
        return createClient(url, key);
      },
      inject: [ConfigService],
    },
    SupabaseService,
  ],
  exports: ['SUPABASE_CLIENT', SupabaseService],
})
export class SupabaseModule {}
