export interface ChatMessage {
  id: string;
  roomId: string;
  content: string;
  senderId: string;
  timestamp: number;
}
