import { ChatParticipantDto } from './chat-participant.dto';
import { IsBoolean, IsDateString, IsString } from 'class-validator';

export class ChatRoomDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsBoolean()
  private: boolean;

  @IsDateString()
  createdAt: string;

  participants: ChatParticipantDto[] = [];
}
