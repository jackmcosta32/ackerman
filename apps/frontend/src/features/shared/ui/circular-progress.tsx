import { cva, type VariantProps } from 'class-variance-authority';

const circularProgressVariants = cva(
  'data-[indeterminate="false"]:animation-paused animate-spin text-inherit inline-block',
  {
    variants: {
      size: {
        xs: 'size-4',
        sm: 'size-5',
        md: 'size-6',
        lg: 'size-7',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface CircularProgressProps
  extends VariantProps<typeof circularProgressVariants>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  indeterminate?: boolean;
}

export function CircularProgress({
  size,
  className,
  indeterminate = true,
  ...rest
}: CircularProgressProps) {
  return (
    <div
      {...rest}
      aria-valuemax={1}
      aria-valuemin={0}
      role="progressbar"
      data-indeterminate={indeterminate}
      className={circularProgressVariants({ size, className })}
    >
      <svg
        viewBox="0 0 32 32"
        height="100%"
        width="100%"
        color="inherit"
        className="size-full"
      >
        <circle
          r="14"
          cx="16"
          cy="16"
          fill="none"
          color="inherit"
          strokeWidth="4"
          style={{
            stroke: 'currentColor',
            opacity: 0.2,
          }}
        />

        <circle
          r="14"
          cx="16"
          cy="16"
          fill="none"
          color="inherit"
          strokeWidth="4"
          style={{
            stroke: 'currentColor',
            strokeDasharray: 80,
            strokeDashoffset: 60,
          }}
        />
      </svg>
    </div>
  );
}
