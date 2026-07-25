import { IsString, IsOptional, IsDateString, IsIn, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateReminderDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  due_date: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsIn(['pending', 'completed', 'overdue', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsUUID()
  unit_id?: string;
}

export class UpdateReminderDto extends PartialType(CreateReminderDto) {}
