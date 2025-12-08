import { useEffect } from 'react';
import { useChat } from '@/features/chat/hooks/use-chat';
import { ChatPrompt } from '@/features/chat/components/chat-prompt';
import { ChatHistory } from '@/features/chat/components/chat-history';

const ROOM_ID = 'global-chat-room';

export const ChatScreen = () => {
  const chat = useChat();

  useEffect(() => {
    chat.joinRoom(ROOM_ID);

    return () => {
      chat.leaveRoom();
    };
  }, []);

  return (
    <div className="relative bg-background min-h-svh bg-green-500 flex flex-col">
      <div>Chat Screen</div>

      <ChatHistory
        className="h-full flex-1"
        senderId={chat.senderId}
        messages={chat.messages}
      />

      <ChatPrompt
        className="self-end sticky bottom-0 z-10"
        onSubmit={chat.sendMessage}
      />
    </div>
  );
};
