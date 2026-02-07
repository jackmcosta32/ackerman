import { LLM_CLIENT } from './ai.tokens';
import { GenerateDto } from './dto/generate.dto';
import { Inject, Injectable } from '@nestjs/common';
import type { AiProvider, AiResponse } from './ai.interface';

@Injectable()
export class AiService {
  constructor(@Inject(LLM_CLIENT) private readonly provider: AiProvider) {}
  generate(generateDto: GenerateDto): Promise<AiResponse> {
    return this.provider.generate(generateDto);
  }
}
