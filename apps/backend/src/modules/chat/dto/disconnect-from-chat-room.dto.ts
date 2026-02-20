import { IsUUID } from 'class-validator';

export class DisconnectFromChatRoomDto {
  @IsUUID()
  chatRoomId: string;
}
