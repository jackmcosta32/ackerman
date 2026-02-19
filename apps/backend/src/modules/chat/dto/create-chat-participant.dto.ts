import { IsEnum } from 'class-validator';
import { ChatParticipantRole } from '@workspace/shared/constants/chat.constant';

export class CreateChatParticipantDto {
  @IsEnum(ChatParticipantRole)
  role: ChatParticipantRole;
}
