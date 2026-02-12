import {
  Column,
  Entity,
  OneToMany,
  JoinColumn,
  ManyToMany,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ChatRoomDto } from '../dto/chat-room.dto';
import { ChatMessage } from './chat-message.entity';
import { ChatParticipant } from './chat-participant.entity';
import { CreateChatRoomDto } from '../dto/create-chat-room.dto';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => ChatParticipant)
  @JoinColumn()
  participants: ChatParticipant[];

  @OneToMany(() => ChatMessage, (message) => message.chatRoom)
  messages: ChatMessage[];

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static fromDto(
    dto: CreateChatRoomDto,
    participants: ChatParticipant[] = [],
  ): ChatRoom {
    const chatRoom = new ChatRoom();

    chatRoom.name = dto.name;
    chatRoom.participants = participants;

    return chatRoom;
  }

  toDto(): ChatRoomDto {
    const dto = new ChatRoomDto();

    dto.id = this.id;
    dto.name = this.name;
    dto.createdAt = this.createdAt.toISOString();

    dto.participants = this.participants.map((participant) =>
      participant.toDto(),
    );

    return dto;
  }
}
