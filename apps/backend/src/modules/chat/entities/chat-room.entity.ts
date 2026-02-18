import {
  Column,
  Entity,
  ManyToOne,
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
import { User } from '@/modules/users/entities/user.entity';
import { ChatParticipant } from './chat-participant.entity';
import { CreateChatRoomDto } from '../dto/create-chat-room.dto';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('uuid')
  ownerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ManyToMany(() => ChatParticipant)
  @JoinColumn()
  participants: ChatParticipant[];

  @OneToMany(() => ChatMessage, (message) => message.chatRoom)
  messages: ChatMessage[];

  @Column('boolean', { default: false })
  private: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static fromDto(
    dto: CreateChatRoomDto,
    user: User,
    participants: ChatParticipant[] = [],
  ): ChatRoom {
    const chatRoom = new ChatRoom();

    chatRoom.owner = user;
    chatRoom.name = dto.name;
    chatRoom.participants = participants;

    return chatRoom;
  }

  toDto(): ChatRoomDto {
    const dto = new ChatRoomDto();

    dto.id = this.id;
    dto.name = this.name;
    dto.private = this.private;
    dto.createdAt = this.createdAt.toISOString();

    dto.participants = this.participants.map((participant) =>
      participant.toDto(),
    );

    return dto;
  }
}
