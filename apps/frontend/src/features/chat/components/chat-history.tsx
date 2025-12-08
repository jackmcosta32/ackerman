import { ChatBubble } from './chat-bubble';
import { cn } from '@/features/shared/utils/style';
import { ScrollArea } from '@/features/shared/ui/scroll-area';
import { ChatMessage } from '@/features/chat/models/chat.model';

export interface ChatHistoryProps
  extends React.ComponentProps<typeof ScrollArea> {
  senderId?: string;
  messages?: ChatMessage[];
}

export const ChatHistory = ({
  senderId,
  messages,
  className,
  ...props
}: ChatHistoryProps) => {
  const renderMessages = () => {
    if (!messages?.length) return null;

    return messages.map((message) => (
      <ChatBubble
        key={message.id}
        sent={message.senderId === senderId}
        className="data-[sent=true]:ml-auto"
      >
        {message.content}
      </ChatBubble>
    ));
  };

  return (
    <ScrollArea
      className={cn('p-4 bg-blue-500 h-full flex-1', className)}
      {...props}
    >
      {renderMessages()}
    </ScrollArea>
  );
};
