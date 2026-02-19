import { IsDateString, IsEnum, IsString, Length } from 'class-validator';
import { ChatParticipantRole } from '@workspace/shared/constants/chat.constant';

export class ChatParticipantDto {
  @IsString()
  id: string;

  @IsString()
  @Length(1, 100)
  name: string;

  @IsDateString()
  createdAt: string;

  @IsEnum(ChatParticipantRole)
  role: ChatParticipantRole;
}
