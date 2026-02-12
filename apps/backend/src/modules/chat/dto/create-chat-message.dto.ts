import { IsString, Length } from 'class-validator';

export class CreateChatMessageDto {
  @IsString()
  @Length(1, 2000)
  content: string;
}
