import {
  Controller,
  Get,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { UpdateTenantDto } from './dto/create-tenant.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { WorkspaceOwnerId } from '../common/decorators/workspace-owner.decorator';

@Controller('api/tenants')
@UseGuards(JwtGuard)
export class TenantGlobalController {
  constructor(private tenantService: TenantService) {}

  @Get()
  async getAllTenants(@WorkspaceOwnerId() userId: string, @Query('search') search?: string) {
    const tenants = await this.tenantService.getAllTenants(userId, search);
    return { status: 'success', data: tenants };
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
