import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsEnum(['available', 'occupied', 'maintenance', 'unavailable'])
  @IsOptional()
  status?: string = 'available';
}

export class UpdateUnitDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsEnum(['available', 'occupied', 'maintenance', 'unavailable'])
  @IsOptional()
  status?: string;
}
