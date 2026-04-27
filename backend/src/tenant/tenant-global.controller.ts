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
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/tenants')
@UseGuards(JwtGuard)
export class TenantGlobalController {
  constructor(private tenantService: TenantService) {}

  @Get()
  async getAllTenants(@CurrentUser('sub') userId: string, @Query('search') search?: string) {
    const tenants = await this.tenantService.getAllTenants(userId, search);
    return { status: 'success', data: tenants };
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
  async deleteTenant(@CurrentUser('sub') userId: string, @Param('id') tenantId: string) {
    await this.tenantService.deleteTenant(userId, tenantId);
  }
}
