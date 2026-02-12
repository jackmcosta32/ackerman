import {
  Entity,
  Unique,
  OneToOne,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { ChatRoom } from './chat-room.entity';
import { ChatMessage } from './chat-message.entity';
import { User } from '@/modules/users/entities/user.entity';
import { ChatParticipantDto } from '../dto/chat-participant.dto';

@Entity()
@Unique(['userId', 'chatRoomId'])
export class ChatParticipant {
  @OneToOne(() => User, { nullable: true })
  user: User;

  @OneToOne(() => ChatRoom, { nullable: true })
  chatRoom: ChatRoom;

  @OneToOne(() => ChatMessage, { nullable: true })
  lastReadMessage?: ChatMessage;

  @OneToMany(() => ChatMessage, (message) => message.sender)
  messages: ChatMessage[];

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static fromDto(user: User, chatRoom: ChatRoom): ChatParticipant {
    const participant = new ChatParticipant();

    participant.user = user;
    participant.chatRoom = chatRoom;

    return participant;
  }

  toDto(): ChatParticipantDto {
    const dto = new ChatParticipantDto();

    dto.id = this.user.id;
    dto.name = this.user.name;
    dto.createdAt = this.createdAt.toISOString();

    return dto;
  }
}
