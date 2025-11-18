import * as React from 'react';

import { cn } from '@/features/shared/utils/style';

export interface InputProps extends React.ComponentProps<'input'> {
  'data-valid'?: boolean;
  'data-invalid'?: boolean;
}

function Input({ className, type, children, disabled, ...props }: InputProps) {
  return (
    <div
      data-valid={props['data-valid']}
      data-invalid={props['data-invalid']}
      data-disabled={disabled}
      className={cn(
        'relative flex flex-row dark:bg-input/30 border-input rounded-md overflow-hidden border',
        'text-base shadow-xs md:text-sm',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        'focus-within:data-[valid=true]:ring-success/20 focus-within:dark:data-[valid=true]:ring-success/40 focus-within:data-[valid=true]:border-success',
        'data-[invalid=true]:ring-destructive/20 dark:data-[invalid=true]:ring-destructive/40 data-[invalid=true]:border-destructive',
        className,
      )}
    >
      <input
        type={type}
        disabled={disabled}
        data-slot="input"
        className={cn(
          'h-9 w-full min-w-0 bg-transparent px-3 py-1 transition-[color,box-shadow] outline-none',
          'placeholder:text-muted-foreground',
          'selection:bg-primary selection:text-primary-foreground',
          'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        )}
        {...props}
      />

      {children}
    </div>
  );
}

export { Input };
