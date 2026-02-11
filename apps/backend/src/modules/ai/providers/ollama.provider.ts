import {
  AiModel,
  type AiRequest,
  type AiProvider,
  type AiResponse,
  type OllamaGenerateRequest,
  type OllamaGenerateResponse,
} from '@/modules/ai/ai.interface';

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class OllamaAiProvider implements AiProvider {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async generate(request: AiRequest): Promise<AiResponse> {
    const ollamaApiUrl =
      this.configService.getOrThrow<string>('OLLAMA_API_URL');

    const requestObserver = this.httpService.post<
      OllamaGenerateResponse,
      OllamaGenerateRequest
    >(`${ollamaApiUrl}/api/generate`, {
      stream: false,
      prompt: request.prompt,
      model: request.model ?? AiModel.LLAMA_3_1,
    });

    const response = await lastValueFrom(requestObserver);
    const responseBody = response.data;

    return {
      done: true,
      response: responseBody.response,
    };
  }

  generateStream(request: AiRequest): Observable<AiResponse> {
    const ollamaApiUrl =
      this.configService.getOrThrow<string>('OLLAMA_API_URL');

    return this.httpService.post<OllamaGenerateResponse>(
      `${ollamaApiUrl}/api/generate`,
      {
        stream: true,
        model: request.model,
        prompt: request.prompt,
      },
      {
        responseType: 'stream',
      },
    ) as never;
  }
}
