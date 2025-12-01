import {
  useSignUp,
  SIGN_UP_PROVIDER,
} from '@/features/authentication/hooks/use-sign-up';

import {
  SignUpForm,
  type SignUpFormValues,
} from '@/features/authentication/components/sign-up-form';

import { toast, Toaster } from '@/features/shared/ui/sonner';
import { Card, CardContent } from '@/features/shared/ui/card';

export const SignUpScreen = () => {
  const signUp = useSignUp();

  const handleOnSignUp = async (params: SignUpFormValues) => {
    try {
      await signUp.mutateAsync({
        ...params,
        provider: SIGN_UP_PROVIDER.LOCAL,
      });

      toast.success('Account created successfully!');
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Card className="max-w-sm w-full m-4">
      <CardContent>
        <SignUpForm onValid={handleOnSignUp} isLoading={signUp.isPending} />
        <Toaster />
      </CardContent>
    </Card>
  );
};
