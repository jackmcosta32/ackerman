import { Length, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateChatRoomDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsBoolean()
  private?: boolean;
}
