import { IsString, IsNumber, IsDate, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsEnum(['income', 'expense'])
  type: string;

  @IsEnum([
    'rent',
    'service_fee',
    'deposit_received',
    'deposit_refund',
    'other_income',
    'repair',
    'maintenance',
    'utilities',
    'electricity',
    'water_sewage',
    'gas',
    'lawn_care',
    'snow_removal',
    'hoa_fee',
    'pest_control',
    'hvac_maintenance',
    'painting',
    'appliance_repair',
    'brokerage',
    'cleaning',
    'tax',
    'insurance',
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
    'deposit_received',
    'deposit_refund',
    'other_income',
    'repair',
    'maintenance',
    'utilities',
    'electricity',
    'water_sewage',
    'gas',
    'lawn_care',
    'snow_removal',
    'hoa_fee',
    'pest_control',
    'hvac_maintenance',
    'painting',
    'appliance_repair',
    'brokerage',
    'cleaning',
    'tax',
    'insurance',
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
