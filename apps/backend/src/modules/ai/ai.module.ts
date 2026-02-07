import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { LLM_CLIENT } from './ai.tokens';
import { HttpModule } from '@nestjs/axios';
import { AiController } from './ai.controller';
import { OllamaAiProvider } from './providers/ollama.provider';

@Module({
  imports: [HttpModule],
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: LLM_CLIENT,
      useClass: OllamaAiProvider,
    },
  ],
  exports: [AiService],
})
export class AiModule {}
