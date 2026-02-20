import { IsUUID } from 'class-validator';

export class ConnectToChatRoomDto {
  @IsUUID()
  chatRoomId: string;
}
