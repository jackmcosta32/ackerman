import {
  IsEnum,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

import { AiModel } from '../ai.interface';

export class GenerateDto {
  @IsOptional()
  @IsEnum(AiModel)
  model?: AiModel = AiModel.DEFAULT;

  @IsString()
  prompt: string;

  @IsOptional()
  @IsString()
  systemPrompt?: string;

  @IsOptional()
  @IsBoolean()
  stream?: boolean;

  @IsOptional()
  @IsNumber()
  maxTokens?: number;

  @IsOptional()
  @IsNumber()
  temperature?: number;
}
