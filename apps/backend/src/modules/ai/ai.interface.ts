import { Observable } from 'rxjs';

export enum AiModel {
  DEFAULT = 'llama3.1:8b',
}

export interface OllamaGenerateRequestOptions {
  seed?: number;
  temperature?: number;
}

/**
 * @see https://docs.ollama.com/api/generate
 */
export interface OllamaGenerateRequest {
  raw?: boolean;
  model: AiModel;
  prompt: string;
  suffix?: string;
  format?: string;
  system?: string;
  stream?: boolean;
  images?: string[];
  options?: OllamaGenerateRequestOptions;
  think?: boolean | 'high' | 'medium' | 'low';
}

/**
 * @see https://docs.ollama.com/api/generate
 */
export interface OllamaGenerateResponse<TResponse = string> {
  model: AiModel;
  done: boolean;
  context: number[];
  created_at: string;
  eval_count: number;
  response: TResponse;
  done_reason: string;
  load_duration: number;
  eval_duration: number;
  total_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
}

export interface AiRequest {
  model?: AiModel;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface AiResponse<TResponse = string> {
  done: boolean;
  response: TResponse;
}

export interface AiProvider {
  generate(prompt: AiRequest): Promise<AiResponse>;
  generateStream(prompt: AiRequest): Observable<AiResponse>;
}
