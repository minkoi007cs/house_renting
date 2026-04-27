import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Inject } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SupabaseClient } from '@supabase/supabase-js';

@Controller('api/upload')
@UseGuards(JwtGuard)
export class UploadController {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@CurrentUser('sub') userId: string, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('No file provided');

    const ext = file.originalname.split('.').pop();
    const fileName = `users/${userId}/${Date.now()}.${ext}`;

    const { error } = await this.supabase.storage
      .from('rental-files')
      .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: false });

    if (error) throw new BadRequestException(error.message);

    const { data } = this.supabase.storage.from('rental-files').getPublicUrl(fileName);
    return { status: 'success', data: { url: data.publicUrl } };
  }
}
