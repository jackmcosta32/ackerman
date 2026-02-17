import { IsOptional, IsUUID } from 'class-validator';

export class EvaluateFeatureFlagDto {
  @IsOptional()
  @IsUUID('4')
  userId?: string;
}
