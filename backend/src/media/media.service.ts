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
    const { data: property } = await this.supabase
      .from('properties')
      .select('id, user_id')
      .eq('id', propertyId)
      .single();

    if (!property || property.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `users/${userId}/properties/${propertyId}/media/${fileName}`;

    const { error: uploadError } = await this.supabase.storage
      .from('rental-files')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrl } = this.supabase.storage.from('rental-files').getPublicUrl(filePath);

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

    if (error) throw error;
    return data;
  }

  async getMedia(userId: string, propertyId: string, type?: string) {
    const { data: property } = await this.supabase
      .from('properties')
      .select('id, user_id')
      .eq('id', propertyId)
      .single();

    if (!property || property.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    let query = this.supabase
      .from('media')
      .select('*')
      .eq('property_id', propertyId)
      .is('deleted_at', null);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query.order('order_index', { ascending: true });
    if (error) throw error;
    return data;
  }

  async deleteMedia(userId: string, mediaId: string) {
    const { data: media } = await this.supabase
      .from('media')
      .select('property:properties(user_id), file_url')
      .eq('id', mediaId)
      .single();

    if (!media || (media.property as any).user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Delete from storage
    const filePath = media.file_url.split('/storage/v1/object/public/rental-files/')[1];
    await this.supabase.storage.from('rental-files').remove([filePath]);

    const { error } = await this.supabase
      .from('media')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', mediaId);

    if (error) throw error;
  }
}
