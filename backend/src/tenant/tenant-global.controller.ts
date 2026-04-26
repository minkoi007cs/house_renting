import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/tenants')
@UseGuards(JwtGuard)
export class TenantGlobalController {
  constructor(private tenantService: TenantService) {}

  @Get()
  async getAllTenants(
    @CurrentUser('sub') userId: string,
    @Query('search') search?: string,
  ) {
    const tenants = await this.tenantService.getAllTenants(userId, search);
    return { status: 'success', data: tenants };
  }
}
