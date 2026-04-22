import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto, UpdateUnitDto } from './dto/create-unit.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('api/properties/:propertyId/units')
@UseGuards(JwtGuard)
export class UnitController {
  constructor(private unitService: UnitService) {}

  @Get()
  async getUnitsByProperty(
    @CurrentUser('sub') userId: string,
    @Param('propertyId') propertyId: string,
  ) {
    const units = await this.unitService.getUnitsByProperty(userId, propertyId);
    return { status: 'success', data: units };
  }

  @Post()
  async createUnit(
    @CurrentUser('sub') userId: string,
    @Param('propertyId') propertyId: string,
    @Body() dto: CreateUnitDto,
  ) {
    const unit = await this.unitService.createUnit(userId, propertyId, dto);
    return { status: 'success', data: unit };
  }

  @Get(':id')
  async getUnitDetail(
    @CurrentUser('sub') userId: string,
    @Param('id') unitId: string,
  ) {
    const unit = await this.unitService.getUnitDetail(userId, unitId);
    return { status: 'success', data: unit };
  }

  @Patch(':id')
  async updateUnit(
    @CurrentUser('sub') userId: string,
    @Param('id') unitId: string,
    @Body() dto: UpdateUnitDto,
  ) {
    const unit = await this.unitService.updateUnit(userId, unitId, dto);
    return { status: 'success', data: unit };
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUnit(
    @CurrentUser('sub') userId: string,
    @Param('id') unitId: string,
  ) {
    await this.unitService.deleteUnit(userId, unitId);
  }
}
