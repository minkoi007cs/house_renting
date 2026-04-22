import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  HttpCode,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('api/properties/:propertyId/media')
@UseGuards(JwtGuard)
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get()
  async getMedia(
    @CurrentUser('sub') userId: string,
    @Param('propertyId') propertyId: string,
    @Query('type') type?: string,
  ) {
    const media = await this.mediaService.getMedia(userId, propertyId, type);
    return { status: 'success', data: media };
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @CurrentUser('sub') userId: string,
    @Param('propertyId') propertyId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: 'image' | 'contract' | 'document',
  ) {
    const media = await this.mediaService.uploadMedia(
      userId,
      propertyId,
      file,
      type,
    );
    return { status: 'success', data: media };
  }

  @Get(':id')
  async getMediaDetail(
    @CurrentUser('sub') userId: string,
    @Param('propertyId') propertyId: string,
    @Param('id') mediaId: string,
  ) {
    const media = await this.mediaService.getMedia(userId, propertyId);
    const detail = media.find((m: any) => m.id === mediaId);
    return { status: 'success', data: detail };
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteMedia(
    @CurrentUser('sub') userId: string,
    @Param('id') mediaId: string,
  ) {
    await this.mediaService.deleteMedia(userId, mediaId);
  }
}
