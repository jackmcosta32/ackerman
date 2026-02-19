import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ChatRoom } from './chat-room.entity';
import { ChatMessageDto } from '../dto/chat-message.dto';
import { ChatParticipant } from './chat-participant.entity';
import { CreateChatMessageDto } from '../dto/create-chat-message.dto';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ChatRoom)
  @JoinColumn()
  chatRoom: ChatRoom;

  @ManyToOne(() => ChatParticipant)
  @JoinColumn()
  sender: ChatParticipant;

  @Column()
  content: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static fromDto(
    sender: ChatParticipant,
    chatRoom: ChatRoom,
    dto: CreateChatMessageDto,
  ): ChatMessage {
    const message = new ChatMessage();

    message.sender = sender;
    message.chatRoom = chatRoom;
    message.content = dto.content;

    return message;
  }

  toDto(): ChatMessageDto {
    const dto = new ChatMessageDto();

    dto.content = this.content;
    dto.chatRoomId = this.chatRoom.id;
    dto.senderId = this.sender.user.id;
    dto.createdAt = this.createdAt.toISOString();
    dto.updatedAt = this.updatedAt.toISOString();

    return dto;
  }
}
