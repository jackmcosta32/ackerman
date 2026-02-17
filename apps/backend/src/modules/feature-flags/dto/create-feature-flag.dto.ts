import {
  IsInt,
  IsArray,
  IsUUID,
  IsString,
  IsBoolean,
  IsOptional,
  MaxLength,
  MinLength,
  Max,
  Min,
} from 'class-validator';

export class CreateFeatureFlagDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  key: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  rolloutPercentage?: number;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  targetUserIds?: string[];
}
