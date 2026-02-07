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

const OLLAMA_API_URL = 'http://localhost:11434';

@Injectable()
export class OllamaAiProvider implements AiProvider {
  constructor(private readonly httpService: HttpService) {}

  async generate(request: AiRequest): Promise<AiResponse> {
    const requestObserver = this.httpService.post<
      OllamaGenerateResponse,
      OllamaGenerateRequest
    >(`${OLLAMA_API_URL}/api/generate`, {
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
    return this.httpService.post<OllamaGenerateResponse>(
      `${OLLAMA_API_URL}/api/generate`,
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
