import { Card, CardContent } from '@/features/shared/ui/card';
import { useSignIn } from '@/features/authentication/hooks/use-sign-in';
import {
  SignInForm,
  type SignInFormValues,
} from '@/features/authentication/components/sign-in-form';

export const SignInScreen = () => {
  const signIn = useSignIn();

  const handleOnSignIn = (params: SignInFormValues) => {
    signIn.mutate(params);
  };

  return (
    <Card className="max-w-sm">
      <CardContent>
        <SignInForm onValid={handleOnSignIn} />
      </CardContent>
    </Card>
  );
};
