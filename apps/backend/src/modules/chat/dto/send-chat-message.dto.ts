import { IsString } from 'class-validator';
import { CreateChatMessageDto } from './create-chat-message.dto';

export class SendChatMessageDto extends CreateChatMessageDto {
  @IsString()
  chatRoomId: string;
}
