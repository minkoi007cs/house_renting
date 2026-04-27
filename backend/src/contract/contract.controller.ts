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
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/units/:unitId/contracts')
@UseGuards(JwtGuard)
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Get()
  async getContracts(@CurrentUser('sub') userId: string, @Param('unitId') unitId: string) {
    const contracts = await this.contractService.getContractsByUnit(userId, unitId);
    return { status: 'success', data: contracts };
  }

  @Post()
  async createContract(
    @CurrentUser('sub') userId: string,
    @Param('unitId') unitId: string,
    @Body() dto: CreateContractDto,
  ) {
    const contract = await this.contractService.createContract(userId, unitId, dto);
    return { status: 'success', data: contract };
  }

  @Get(':id')
  async getContractDetail(@CurrentUser('sub') userId: string, @Param('id') contractId: string) {
    const contract = await this.contractService.getContractDetail(userId, contractId);
    return { status: 'success', data: contract };
  }

  @Patch(':id')
  async updateContract(
    @CurrentUser('sub') userId: string,
    @Param('id') contractId: string,
    @Body() dto: UpdateContractDto,
  ) {
    const contract = await this.contractService.updateContract(userId, contractId, dto);
    return { status: 'success', data: contract };
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteContract(@CurrentUser('sub') userId: string, @Param('id') contractId: string) {
    await this.contractService.deleteContract(userId, contractId);
  }
}
