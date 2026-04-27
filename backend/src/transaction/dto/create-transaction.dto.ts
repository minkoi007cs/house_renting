import { IsString, IsNumber, IsDate, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsEnum(['income', 'expense'])
  type: string;

  @IsEnum([
    'rent',
    'service_fee',
    'deposit_refund',
    'other_income',
    'repair',
    'maintenance',
    'utilities',
    'brokerage',
    'cleaning',
    'other_expense',
  ])
  category: string;

  @IsNumber()
  amount: number;

  @Type(() => Date)
  @IsDate()
  transaction_date: Date;

  @IsString()
  @IsOptional()
  note?: string;

  @IsUUID()
  @IsOptional()
  unit_id?: string;
}

export class UpdateTransactionDto {
  @IsEnum(['income', 'expense'])
  @IsOptional()
  type?: string;

  @IsEnum([
    'rent',
    'service_fee',
    'deposit_refund',
    'other_income',
    'repair',
    'maintenance',
    'utilities',
    'brokerage',
    'cleaning',
    'other_expense',
  ])
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  transaction_date?: Date;

  @IsString()
  @IsOptional()
  note?: string;
}
