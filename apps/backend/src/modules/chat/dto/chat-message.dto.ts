import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  chatRoomId: string;

  @IsString()
  @Length(1, 2000)
  content: string;

  @IsOptional()
  @IsString()
  senderId?: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}
