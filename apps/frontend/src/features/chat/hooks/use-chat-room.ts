// TODO: Rename join and leave room methods to listen and unlisten to better reflect their purpose

import { useCallback, useRef, useState } from 'react';
import { socketApiClient } from '@/data/socket/clients';
import type { ChatMessage } from '@/features/chat/models/chat.model';

export const useChatRoom = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatRoomIdRef = useRef<string | null>(null);

  const handleOnNewMessage = useCallback((message: ChatMessage) => {
    setMessages((previousMessages) => [...previousMessages, message]);
  }, []);

  const handleLeaveRoom = () => {
    if (!chatRoomIdRef.current) return;

    socketApiClient.emit('leave_room', chatRoomIdRef.current);

    socketApiClient.off('new_message', handleOnNewMessage);

    chatRoomIdRef.current = null;
  };

  const handleJoinRoom = (chatRoomId: string) => {
    if (chatRoomIdRef.current) handleLeaveRoom();

    chatRoomIdRef.current = chatRoomId;

    socketApiClient.emit('join_room', chatRoomId);

    socketApiClient.on('new_message', handleOnNewMessage);
  };

  const handleSendMessage = (content: string) => {
    if (!chatRoomIdRef.current) return;

    socketApiClient.emit('send_message', {
      chatRoomId: chatRoomIdRef.current,
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
