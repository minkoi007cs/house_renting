import { Injectable, Inject, ForbiddenException, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class MediaService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async uploadMedia(
    userId: string,
    propertyId: string,
    file: any,
    type: 'image' | 'contract' | 'document',
  ) {
    console.log(
      '[Media] uploadMedia: userId =',
      userId,
      '| propertyId =',
      propertyId,
      '| type =',
      type,
    );
    console.log(
      '[Media] uploadMedia: file =',
      file ? { name: file.originalname, size: file.size, mime: file.mimetype } : 'MISSING',
    );

    if (!file) {
      console.error('[Media] uploadMedia: file is undefined/null');
      throw new BadRequestException('No file provided');
    }

    const { data: property, error: propError } = await this.supabase
      .from('properties')
      .select('id, user_id')
      .eq('id', propertyId)
      .single();

    if (propError) console.error('[Media] uploadMedia: property lookup error -', propError);

    if (!property || property.user_id !== userId) {
      console.error(
        '[Media] uploadMedia: FORBIDDEN - property.user_id =',
        property?.user_id,
        '!= userId =',
        userId,
      );
      throw new ForbiddenException('Access denied');
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `users/${userId}/properties/${propertyId}/media/${fileName}`;
    console.log('[Media] uploadMedia: uploading to storage path =', filePath);

    const { error: uploadError } = await this.supabase.storage
      .from('rental-files')
      .upload(filePath, file.buffer, { contentType: file.mimetype });

    if (uploadError) {
      console.error('[Media] uploadMedia: STORAGE UPLOAD FAILED -', uploadError);
      throw uploadError;
    }
    console.log('[Media] uploadMedia: storage upload OK');

    const { data: publicUrl } = this.supabase.storage.from('rental-files').getPublicUrl(filePath);
    console.log('[Media] uploadMedia: publicUrl =', publicUrl.publicUrl);

    const { data, error } = await this.supabase
      .from('media')
      .insert([
        {
          property_id: propertyId,
          type,
          file_url: publicUrl.publicUrl,
          file_name: file.originalname,
          file_size: file.size,
          mime_type: file.mimetype,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[Media] uploadMedia: DB INSERT FAILED -', error);
      throw error;
    }
    console.log('[Media] uploadMedia: OK, media id =', data.id);
    return data;
  }

  async getMedia(userId: string, propertyId: string, type?: string) {
    console.log(
      '[Media] getMedia: userId =',
      userId,
      '| propertyId =',
      propertyId,
      '| type =',
      type,
    );
    const { data: property, error: propError } = await this.supabase
      .from('properties')
      .select('id, user_id')
      .eq('id', propertyId)
      .single();

    if (propError) console.error('[Media] getMedia: property lookup error -', propError);

    if (!property || property.user_id !== userId) {
      console.error('[Media] getMedia: FORBIDDEN');
      throw new ForbiddenException('Access denied');
    }

    let query = this.supabase
      .from('media')
      .select('*')
      .eq('property_id', propertyId)
      .is('deleted_at', null);

    if (type) query = query.eq('type', type);

    const { data, error } = await query.order('order_index', { ascending: true });
    if (error) {
      console.error('[Media] getMedia: SELECT FAILED -', error);
      throw error;
    }
    console.log('[Media] getMedia: OK, count =', data?.length);
    return data;
  }

  async deleteMedia(userId: string, mediaId: string) {
    console.log('[Media] deleteMedia: userId =', userId, '| mediaId =', mediaId);
    const { data: media, error: mediaError } = await this.supabase
      .from('media')
      .select('property:properties(user_id), file_url')
      .eq('id', mediaId)
      .single();

    if (mediaError) console.error('[Media] deleteMedia: lookup error -', mediaError);

    if (!media || (media.property as any).user_id !== userId) {
      console.error('[Media] deleteMedia: FORBIDDEN');
      throw new ForbiddenException('Access denied');
    }

    const filePath = media.file_url.split('/storage/v1/object/public/rental-files/')[1];
    console.log('[Media] deleteMedia: removing from storage path =', filePath);
    await this.supabase.storage.from('rental-files').remove([filePath]);

    const { error } = await this.supabase
      .from('media')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', mediaId);

    if (error) {
      console.error('[Media] deleteMedia: UPDATE FAILED -', error);
      throw error;
    }
    console.log('[Media] deleteMedia: OK (soft delete)');
  }
}
