import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/features/shared/ui/tooltip';

import { useRef } from 'react';
import { PlusIcon } from 'lucide-react';
import { Kbd } from '@/features/shared/ui/kbd';
import { cn } from '@/features/shared/utils/style';
import { Button } from '@/features/shared/ui/button';
import { ScrollArea } from '@/features/shared/ui/scroll-area';

const SUBMIT_KEY = 'Enter';

export interface ChatPromptProps
  extends Omit<React.ComponentProps<'div'>, 'onSubmit'> {
  onSubmit?: (message: string) => void;
}

export const ChatPrompt = ({
  onSubmit,
  onKeyDown,
  className,
  ...rest
}: ChatPromptProps) => {
  const inputRef = useRef<HTMLDivElement>(null);

  const handleOnKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (
    event,
  ) => {
    if (typeof onKeyDown === 'function') {
      onKeyDown(event);
    }

    const input = inputRef.current;

    if (!input) return;

    const isSubmitting = event.key === SUBMIT_KEY && !event.shiftKey;

    if (!isSubmitting) return;

    event.preventDefault();

    const message = input?.innerText;
    const sanitizedMessage = message?.trim();

    if (!sanitizedMessage) return;

    input.innerText = '';

    if (typeof onSubmit !== 'function') return;

    onSubmit(sanitizedMessage);
  };

  return (
    <div
      {...rest}
      autoFocus
      className={cn('flex flex-row w-full bg-red-500 items-center', className)}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <PlusIcon />
          </Button>
        </TooltipTrigger>

        <TooltipContent>
          <p className="flex flex-row gap-2 items-center">
            Add files and more <Kbd>/</Kbd>
          </p>
        </TooltipContent>
      </Tooltip>

      <ScrollArea className="w-full flex flex-1 overflow-hidden bg-blue-500">
        <div
          dir="ltr"
          autoFocus
          role="textbox"
          ref={inputRef}
          contentEditable
          aria-autocomplete="list"
          onKeyDown={handleOnKeyDown}
          data-placeholder="Ask anything"
          className="
            w-full
            max-h-40
            outline-none
            whitespace-pre-wrap
            empty:before:content-[attr(data-placeholder)]
          "
        />
      </ScrollArea>

      <Button variant="ghost" size="icon">
        <PlusIcon />
      </Button>
    </div>
  );
};
