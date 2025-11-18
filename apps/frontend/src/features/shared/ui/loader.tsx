import { cn } from '@/features/shared/utils/style';
import { CircularProgress } from '@/features/shared/ui/circular-progress';

export interface LoadingComponentProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    LoadingComponentProps {
  loading?: boolean;
  backdrop?: boolean;
  keepMounted?: boolean;
  loadingComponent?: React.FC<Partial<LoadingComponentProps>>;
}

export function Loader({
  size,
  loading,
  backdrop,
  className,
  loadingComponent,
  keepMounted = true,
  ...rest
}: LoaderProps) {
  const shouldUnmount = !keepMounted && !loading;
  const Component = loadingComponent ?? CircularProgress;

  if (shouldUnmount) return null;

  return (
    <div
      {...rest}
      aria-live="polite"
      aria-busy={loading}
      data-loading={loading}
      data-backdrop={backdrop}
      className={cn(
        'z-10 absolute flex opacity-0 inset-0 items-center justify-center pointer-events-none transition-opacity',
        'data-[loading=true]:opacity-100 data-[loading=true]:cursor-wait data-[loading=true]:pointer-events-auto',
        'data-[backdrop=true]:after:-z-10 data-[backdrop=true]:after:size-full data-[backdrop=true]:after:absolute data-[backdrop=true]:after:opacity-10 data-[backdrop=true]:after:bg-foreground',
        className,
      )}
    >
      <Component size={size} indeterminate={loading} />
    </div>
  );
}
