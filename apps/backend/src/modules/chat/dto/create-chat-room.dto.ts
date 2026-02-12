import { IsString, Length } from 'class-validator';

export class CreateChatRoomDto {
  @IsString()
  @Length(1, 100)
  name: string;
}
