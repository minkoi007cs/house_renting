import { IsDate, IsNumber, IsString, IsOptional, IsEnum, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContractDto {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  signed_date?: Date;

  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  end_date?: Date;

  @IsNumber()
  rent_amount: number;

  @IsNumber()
  @IsOptional()
  deposit_amount?: number = 0;

  @IsString()
  payment_cycle: string;

  @IsString()
  @IsOptional()
  terms?: string;

  @IsEnum(['draft', 'signed', 'active', 'expired', 'terminated', 'renewed'])
  @IsOptional()
  status?: string = 'draft';

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  tenant_ids?: string[];
}

export class UpdateContractDto {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  signed_date?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  start_date?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  end_date?: Date;

  @IsNumber()
  @IsOptional()
  rent_amount?: number;

  @IsNumber()
  @IsOptional()
  deposit_amount?: number;

  @IsString()
  @IsOptional()
  payment_cycle?: string;

  @IsString()
  @IsOptional()
  terms?: string;

  @IsEnum(['draft', 'signed', 'active', 'expired', 'terminated', 'renewed'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
