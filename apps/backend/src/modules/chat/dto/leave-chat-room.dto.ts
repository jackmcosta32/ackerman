import { IsUUID } from 'class-validator';

export class LeaveChatRoomDto {
  @IsUUID()
  chatRoomId: string;
}
