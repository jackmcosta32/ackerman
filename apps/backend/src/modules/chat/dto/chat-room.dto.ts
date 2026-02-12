import { IsDateString, IsString } from 'class-validator';
import { ChatParticipantDto } from './chat-participant.dto';

export class ChatRoomDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsDateString()
  createdAt: string;

  participants: ChatParticipantDto[] = [];
}
