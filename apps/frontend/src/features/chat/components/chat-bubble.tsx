import { cn } from '@/features/shared/utils/style';

export interface ChatBubbleProps extends React.ComponentProps<'div'> {
  sent?: boolean;
  hideTail?: boolean;
  stamp?: React.ReactNode;
}

export const ChatBubble = ({
  sent,
  stamp,
  hideTail,
  children,
  className,
  ...rest
}: ChatBubbleProps) => {
  return (
    <div
      data-sent={sent}
      className={cn(
        'text-sm relative flex flex-col bg-red-500 after:border-red-500 rounded-md w-fit p-2 mb-1',
        !hideTail &&
          'after:content-[""] after:absolute after:top-0 after:border-b-transparent after:border-solid',
        !sent &&
          'ml-4 rounded-tl-none after:right-full after:border-5 after:border-l-transparent',
        sent &&
          'mr-4 rounded-tr-none after:left-full after:border-5 after:border-r-transparent',
        stamp && 'pb-1',
        hideTail && 'rounded-md',
        className,
      )}
      {...rest}
    >
      <span>{children}</span>

      {stamp && (
        <span className="text-right text-muted-foreground">{stamp}</span>
      )}
    </div>
  );
};
