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
import { ContractService } from './contract.service';
import { CreateContractDto, UpdateContractDto } from './dto/create-contract.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { WorkspaceOwnerId } from '../common/decorators/workspace-owner.decorator';

@Controller('api/units/:unitId/contracts')
@UseGuards(JwtGuard)
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Get()
  async getContracts(@WorkspaceOwnerId() userId: string, @Param('unitId') unitId: string) {
    const contracts = await this.contractService.getContractsByUnit(userId, unitId);
    return { status: 'success', data: contracts };
  }

  @Post()
  async createContract(
    @WorkspaceOwnerId() userId: string,
    @Param('unitId') unitId: string,
    @Body() dto: CreateContractDto,
  ) {
    const contract = await this.contractService.createContract(userId, unitId, dto);
    return { status: 'success', data: contract };
  }

  @Get(':id')
  async getContractDetail(@WorkspaceOwnerId() userId: string, @Param('id') contractId: string) {
    const contract = await this.contractService.getContractDetail(userId, contractId);
    return { status: 'success', data: contract };
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
