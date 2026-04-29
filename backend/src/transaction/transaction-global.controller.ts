import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { UpdateTransactionDto } from './dto/create-transaction.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

const toPositiveInt = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
};

@Controller('api/transactions')
@UseGuards(JwtGuard)
export class TransactionGlobalController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  async list(
    @CurrentUser('sub') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    const safePage = toPositiveInt(page, 1);
    const safeLimit = Math.min(toPositiveInt(limit, 50), 500);
    const skip = (safePage - 1) * safeLimit;
    const result = await this.transactionService.getAllTransactions(
      userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      type,
      category,
      skip,
      safeLimit,
    );
    return { status: 'success', data: result };
  }

  @Get('summary')
  async summary(
    @CurrentUser('sub') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const data = await this.transactionService.getGlobalSummary(
      userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    return { status: 'success', data };
  }

  @Patch(':id')
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    const tx = await this.transactionService.updateTransaction(userId, id, dto);
    return { status: 'success', data: tx };
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    await this.transactionService.deleteTransaction(userId, id);
  }
}
