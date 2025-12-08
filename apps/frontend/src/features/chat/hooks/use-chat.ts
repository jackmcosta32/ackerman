import { useCallback, useRef, useState } from 'react';
import { socketApiClient } from '@/data/socket/clients';
import type { ChatMessage } from '@/features/chat/models/chat.model';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const roomIdRef = useRef<string | null>(null);

  const handleOnNewMessage = useCallback((message: ChatMessage) => {
    console.log('New message received:', message);

    setMessages((previousMessages) => [...previousMessages, message]);
  }, []);

  const handleLeaveRoom = () => {
    if (!roomIdRef.current) return;

    socketApiClient.emit('leave_room', roomIdRef.current);

    socketApiClient.off('new_message', handleOnNewMessage);

    roomIdRef.current = null;
  };

  const handleJoinRoom = (roomId: string) => {
    if (roomIdRef.current) handleLeaveRoom();

    roomIdRef.current = roomId;

    socketApiClient.emit('join_room', roomId);

    socketApiClient.on('new_message', handleOnNewMessage);
  };

  const handleSendMessage = (content: string) => {
    if (!roomIdRef.current) return;

    socketApiClient.emit('send_message', {
      roomId: roomIdRef.current,
      content,
    });
  };

  return {
    messages,
    senderId: socketApiClient.id,
    joinRoom: handleJoinRoom,
    leaveRoom: handleLeaveRoom,
    sendMessage: handleSendMessage,
  };
};
