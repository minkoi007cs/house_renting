import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  Length,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @Length(5, 500)
  address: string;

  @IsEnum([
    'house',
    'apartment',
    'condo',
    'townhouse',
    'duplex',
    'multi_family',
    'mobile_home',
    'land',
    'other',
  ])
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

  @IsNumber()
  @IsOptional()
  @Min(0)
  monthly_rent?: number;

  @IsString()
  @IsOptional()
  cover_image_url?: string;

  @IsArray()
  @IsOptional()
  image_urls?: string[];
}
