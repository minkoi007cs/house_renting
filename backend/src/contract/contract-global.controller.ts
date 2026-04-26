import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ContractService } from './contract.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/contracts')
@UseGuards(JwtGuard)
export class ContractGlobalController {
  constructor(private contractService: ContractService) {}

  @Get()
  async getAllContracts(
    @CurrentUser('sub') userId: string,
    @Query('status') status?: string,
  ) {
    const contracts = await this.contractService.getAllContracts(userId, status);
    return { status: 'success', data: contracts };
  }
}
