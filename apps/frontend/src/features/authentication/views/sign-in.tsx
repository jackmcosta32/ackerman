import {
  SignInForm,
  type SignInFormValues,
} from '@/features/authentication/components/sign-in-form';

import { useNavigate } from 'react-router';
import { HOME_PATH } from '@/constants/paths';
import { Card, CardContent } from '@/features/shared/ui/card';
import { useSignIn } from '@/features/authentication/hooks/use-sign-in';

export const SignInScreen = () => {
  const navigate = useNavigate();
  const signIn = useSignIn();

  const handleOnSignIn = async (params: SignInFormValues) => {
    try {
      await signIn.mutateAsync(params);

      navigate(HOME_PATH);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Card className="max-w-sm w-full m-4">
      <CardContent>
        <SignInForm onValid={handleOnSignIn} isLoading={signIn.isPending} />
      </CardContent>
    </Card>
  );
};
