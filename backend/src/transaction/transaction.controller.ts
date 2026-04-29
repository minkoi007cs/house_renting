import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  HttpCode,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto/create-transaction.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

const toPositiveInt = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
};

@Controller('api/properties/:propertyId/transactions')
@UseGuards(JwtGuard)
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  async getTransactions(
    @CurrentUser('sub') userId: string,
    @Param('propertyId') propertyId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const safePage = toPositiveInt(page, 1);
    const safeLimit = Math.min(toPositiveInt(limit, 20), 500);
    const skip = (safePage - 1) * safeLimit;
    const result = await this.transactionService.getTransactions(
      userId,
      propertyId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      type,
      category,
      skip,
      safeLimit,
    );
    return { status: 'success', data: result };
  }

  @Post()
  async createTransaction(
    @CurrentUser('sub') userId: string,
    @Param('propertyId') propertyId: string,
    @Body() dto: CreateTransactionDto,
  ) {
    const transaction = await this.transactionService.createTransaction(userId, propertyId, dto);
    return { status: 'success', data: transaction };
  }

  @Get(':id')
  async getTransactionDetail(
    @CurrentUser('sub') userId: string,
    @Param('id') transactionId: string,
  ) {
    const transaction = await this.transactionService.getTransactionById(userId, transactionId);
    return { status: 'success', data: transaction };
  }

  @Patch(':id')
  async updateTransaction(
    @CurrentUser('sub') userId: string,
    @Param('id') transactionId: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    const transaction = await this.transactionService.updateTransaction(userId, transactionId, dto);
    return { status: 'success', data: transaction };
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTransaction(@CurrentUser('sub') userId: string, @Param('id') transactionId: string) {
    await this.transactionService.deleteTransaction(userId, transactionId);
  }
}
