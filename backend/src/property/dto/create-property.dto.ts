import { IsString, IsOptional, IsEnum, Length, MaxLength } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @Length(5, 500)
  address: string;

  @IsEnum(['house', 'apartment', 'townhouse', 'land', 'other'])
  type: string;

  @IsEnum(['active', 'inactive', 'sold'])
  @IsOptional()
  status?: string = 'active';

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}
