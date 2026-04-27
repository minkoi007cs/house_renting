import { Controller, Get, UseGuards, Query, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/analytics')
@UseGuards(JwtGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboard(
    @CurrentUser('sub') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const dashboard = await this.analyticsService.getDashboard(
      userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    return { status: 'success', data: dashboard };
  }

  @Get('property/:propertyId')
  async getPropertyAnalytics(
    @CurrentUser('sub') userId: string,
    @Param('propertyId') propertyId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const analytics = await this.analyticsService.getPropertyAnalytics(
      userId,
      propertyId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    return { status: 'success', data: analytics };
  }
}
