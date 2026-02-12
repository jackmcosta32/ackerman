import { IsDateString, IsString, Length } from 'class-validator';

export class ChatParticipantDto {
  @IsString()
  id: string;

  @IsString()
  @Length(1, 100)
  name: string;

  @IsDateString()
  createdAt: string;
}
