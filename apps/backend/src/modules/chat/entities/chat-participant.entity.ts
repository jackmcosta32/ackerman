import {
  Entity,
  Column,
  Unique,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ChatRoom } from './chat-room.entity';
import { ChatMessage } from './chat-message.entity';
import { User } from '@/modules/users/entities/user.entity';
import { ChatParticipantDto } from '../dto/chat-participant.dto';
import { ChatParticipantRole } from '@workspace/shared/constants/chat.constant';
import { CreateChatParticipantDto } from '../dto/create-chat-participant.dto';

@Entity()
@Unique(['userId', 'chatRoomId'])
export class ChatParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  chatRoomId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => ChatRoom, { nullable: true })
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoom;

  @OneToOne(() => ChatMessage, { nullable: true })
  @JoinColumn({ name: 'lastReadMessageId' })
  lastReadMessage?: ChatMessage;

  @OneToMany(() => ChatMessage, (message) => message.sender)
  messages: ChatMessage[];

  @Column({
    type: 'enum',
    enum: ChatParticipantRole,
    default: ChatParticipantRole.USER,
  })
  role: ChatParticipantRole;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static fromDto(
    user: User,
    chatRoom: ChatRoom,
    dto: CreateChatParticipantDto,
  ): ChatParticipant {
    const participant = new ChatParticipant();

    participant.user = user;
    participant.chatRoom = chatRoom;
    participant.role = dto.role;

    return participant;
  }

  toDto(): ChatParticipantDto {
    const dto = new ChatParticipantDto();

    dto.role = this.role;
    dto.id = this.user.id;
    dto.name = this.user.name;
    dto.createdAt = this.createdAt.toISOString();

    return dto;
  }
}
