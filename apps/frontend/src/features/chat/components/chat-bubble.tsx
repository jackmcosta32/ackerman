import { cn } from '@/features/shared/utils/style';

export interface ChatBubbleProps extends React.ComponentProps<'div'> {
  sent?: boolean;
  bottomGutter?: boolean;
  stamp?: React.ReactNode;
}

export const ChatBubble = ({
  sent,
  stamp = '4 minutes ago',
  children,
  className,
  bottomGutter,
  ...rest
}: ChatBubbleProps) => {
  return (
    <div
      data-sent={sent}
      className={cn(
        'text-sm relative flex flex-col bg-red-500 after:border-red-500 rounded-md w-fit p-2 mb-1',
        'after:content-[""] after:absolute after:top-0 after:border-b-transparent after:border-solid',
        !sent &&
          'ml-4 rounded-tl-none after:right-full after:border-5 after:border-l-transparent',
        sent &&
          'mr-4 rounded-tr-none after:left-full after:border-5 after:border-r-transparent',
        bottomGutter && 'mb-4',
        stamp && 'pb-1',
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
