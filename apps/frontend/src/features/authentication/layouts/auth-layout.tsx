export type AuthLayoutProps = React.ComponentProps<'main'>;

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className="flex-1 flex min-h-screen justify-center items-center bg-background">
      {children}
    </main>
  );
};
