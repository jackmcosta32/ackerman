import { Type } from 'class-transformer';
import type { PaginatedRequest } from '@workspace/shared';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginatedRequestDto implements PaginatedRequest {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  public readonly limit: number = 10;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  public readonly page: number = 0;
}
