import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  HttpCode,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto, UpdatePropertyDto } from './dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { WorkspaceOwnerId } from '../common/decorators/workspace-owner.decorator';

@Controller('api/properties')
@UseGuards(JwtGuard)
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @Get()
  async getProperties(
    @WorkspaceOwnerId() userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const result = await this.propertyService.getProperties(userId, skip, limit);
    return { status: 'success', data: result };
  }

  @Post()
  async createProperty(@WorkspaceOwnerId() userId: string, @Body() dto: CreatePropertyDto) {
    const property = await this.propertyService.createProperty(userId, dto);
    return { status: 'success', data: property };
  }

  @Get(':id')
  async getPropertyDetail(@WorkspaceOwnerId() userId: string, @Param('id') propertyId: string) {
    const property = await this.propertyService.getPropertyDetail(userId, propertyId);
    return { status: 'success', data: property };
  }

  @Patch(':id')
  async updateProperty(
    @WorkspaceOwnerId() userId: string,
    @Param('id') propertyId: string,
    @Body() dto: UpdatePropertyDto,
  ) {
    const property = await this.propertyService.updateProperty(userId, propertyId, dto);
    return { status: 'success', data: property };
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteProperty(@WorkspaceOwnerId() userId: string, @Param('id') propertyId: string) {
    await this.propertyService.deleteProperty(userId, propertyId);
  }
}
