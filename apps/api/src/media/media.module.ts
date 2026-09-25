import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { UploadController } from './upload.controller';
import { SupabaseModule } from '../config/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [MediaController, UploadController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
