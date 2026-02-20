import type { Entity } from '@/features/shared/models/entity.model';

export interface ChatRoom extends Entity {
  name: string;
}

export interface ChatParticipant extends Entity {
  userId: string;
  chatRoomId: string;
}

export interface ChatMessage extends Entity {
  roomId: string;
  content: string;
  senderId: string;
}
