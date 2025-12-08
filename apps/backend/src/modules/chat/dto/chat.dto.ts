import { IsString, Length } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  roomId: string;

  @IsString()
  @Length(1, 2000)
  content: string;
}
