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
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/properties')
@UseGuards(JwtGuard)
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @Get()
  async getProperties(
    @CurrentUser('sub') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const result = await this.propertyService.getProperties(userId, skip, limit);
    return { status: 'success', data: result };
  }

  @Post()
  async createProperty(@CurrentUser('sub') userId: string, @Body() dto: CreatePropertyDto) {
    const property = await this.propertyService.createProperty(userId, dto);
    return { status: 'success', data: property };
  }

  @Get(':id')
  async getPropertyDetail(@CurrentUser('sub') userId: string, @Param('id') propertyId: string) {
    const property = await this.propertyService.getPropertyDetail(userId, propertyId);
    return { status: 'success', data: property };
  }

  @Patch(':id')
  async updateProperty(
    @CurrentUser('sub') userId: string,
    @Param('id') propertyId: string,
    @Body() dto: UpdatePropertyDto,
  ) {
    const property = await this.propertyService.updateProperty(userId, propertyId, dto);
    return { status: 'success', data: property };
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteProperty(@CurrentUser('sub') userId: string, @Param('id') propertyId: string) {
    await this.propertyService.deleteProperty(userId, propertyId);
  }
}
