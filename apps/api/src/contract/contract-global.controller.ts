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
import { ContractService } from './contract.service';
import { UpdateContractDto } from './dto/create-contract.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { WorkspaceOwnerId } from '../common/decorators/workspace-owner.decorator';

@Controller('api/contracts')
@UseGuards(JwtGuard)
export class ContractGlobalController {
  constructor(private contractService: ContractService) {}

  @Get()
  async getAllContracts(@WorkspaceOwnerId() userId: string, @Query('status') status?: string) {
    const contracts = await this.contractService.getAllContracts(userId, status);
    return { status: 'success', data: contracts };
  }

  @Patch(':id')
  async updateContract(
    @WorkspaceOwnerId() userId: string,
    @Param('id') contractId: string,
    @Body() dto: UpdateContractDto,
  ) {
    const contract = await this.contractService.updateContract(userId, contractId, dto);
    return { status: 'success', data: contract };
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteContract(@WorkspaceOwnerId() userId: string, @Param('id') contractId: string) {
    await this.contractService.deleteContract(userId, contractId);
  }
}
