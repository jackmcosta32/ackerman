import { IsUUID } from 'class-validator';

export class JoinChatRoomDto {
  @IsUUID()
  chatRoomId: string;
}
