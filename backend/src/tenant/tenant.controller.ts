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
import { TenantService } from './tenant.service';
import { CreateTenantDto, UpdateTenantDto } from './dto/create-tenant.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('api/units/:unitId/tenants')
@UseGuards(JwtGuard)
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Get()
  async getTenantsByUnit(
    @CurrentUser('sub') userId: string,
    @Param('unitId') unitId: string,
  ) {
    const tenants = await this.tenantService.getTenantsByUnit(userId, unitId);
    return { status: 'success', data: tenants };
  }

  @Post()
  async createTenant(
    @CurrentUser('sub') userId: string,
    @Param('unitId') unitId: string,
    @Body() dto: CreateTenantDto,
  ) {
    const tenant = await this.tenantService.createTenant(userId, unitId, dto);
    return { status: 'success', data: tenant };
  }

  @Get(':id')
  async getTenantDetail(
    @CurrentUser('sub') userId: string,
    @Param('id') tenantId: string,
  ) {
    const tenant = await this.tenantService.getTenantDetail(userId, tenantId);
    return { status: 'success', data: tenant };
  }

  @Patch(':id')
  async updateTenant(
    @CurrentUser('sub') userId: string,
    @Param('id') tenantId: string,
    @Body() dto: UpdateTenantDto,
  ) {
    const tenant = await this.tenantService.updateTenant(userId, tenantId, dto);
    return { status: 'success', data: tenant };
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTenant(
    @CurrentUser('sub') userId: string,
    @Param('id') tenantId: string,
  ) {
    await this.tenantService.deleteTenant(userId, tenantId);
  }
}
