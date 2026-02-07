import { AiService } from './ai.service';
import { LLM_CLIENT } from './ai.tokens';
import { GenerateDto } from './dto/generate.dto';
import { Body, Inject, Controller, Post } from '@nestjs/common';

@Controller('ai')
export class AiController {
  constructor(@Inject(LLM_CLIENT) private readonly aiService: AiService) {}

  @Post('generate')
  async generate(@Body() generateDto: GenerateDto) {
    return this.aiService.generate(generateDto);
  }
}
