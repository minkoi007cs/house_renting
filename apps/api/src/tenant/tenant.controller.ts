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
import { JwtGuard } from '../common/guards/jwt.guard';
import { WorkspaceOwnerId } from '../common/decorators/workspace-owner.decorator';

@Controller('api/units/:unitId/tenants')
@UseGuards(JwtGuard)
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Get()
  async getTenantsByUnit(@WorkspaceOwnerId() userId: string, @Param('unitId') unitId: string) {
    const tenants = await this.tenantService.getTenantsByUnit(userId, unitId);
    return { status: 'success', data: tenants };
  }

  @Post()
  async createTenant(
    @WorkspaceOwnerId() userId: string,
    @Param('unitId') unitId: string,
    @Body() dto: CreateTenantDto,
  ) {
    const tenant = await this.tenantService.createTenant(userId, unitId, dto);
    return { status: 'success', data: tenant };
  }

  @Get(':id')
  async getTenantDetail(@WorkspaceOwnerId() userId: string, @Param('id') tenantId: string) {
    const tenant = await this.tenantService.getTenantDetail(userId, tenantId);
    return { status: 'success', data: tenant };
  }

  @Patch(':id')
  async updateTenant(
    @WorkspaceOwnerId() userId: string,
    @Param('id') tenantId: string,
    @Body() dto: UpdateTenantDto,
  ) {
    const tenant = await this.tenantService.updateTenant(userId, tenantId, dto);
    return { status: 'success', data: tenant };
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTenant(@WorkspaceOwnerId() userId: string, @Param('id') tenantId: string) {
    await this.tenantService.deleteTenant(userId, tenantId);
  }
}
