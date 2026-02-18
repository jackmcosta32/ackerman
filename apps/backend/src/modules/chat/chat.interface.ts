export interface FindAllChatRoomsDataResult {
  id: string;
  name: string;
  private: boolean;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  participantCount: number;
  unreadMessageCount: number;
  lastMessageAt: string | null;
}

export interface FindAllChatRoomsCountResult {
  count: number;
}
