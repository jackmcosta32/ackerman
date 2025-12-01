import { Slot } from '@radix-ui/react-slot';
import { Link as BaseLink } from 'react-router';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/features/shared/utils/style';

const linkVariants = cva(
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stroke-primary-subtle ring-offset-2 disabled:pointer-events-none disabled:text-tertiary',
  {
    variants: {
      variant: {
        flat: '',
        default:
          'transition-colors text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg h-9 text-primary hover:text-primary/80 active:text-primary/80 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface LinkProps
  extends React.ComponentPropsWithoutRef<typeof BaseLink>,
    VariantProps<typeof linkVariants> {
  asChild?: boolean;
}

export const Link = ({
  asChild,
  variant,
  children,
  className,
  ...rest
}: LinkProps) => {
  const Comp = asChild ? Slot : BaseLink;

  return (
    <Comp className={cn(linkVariants({ variant }), className)} {...rest}>
      {children}
    </Comp>
  );
};
