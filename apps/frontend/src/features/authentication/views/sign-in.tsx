import {
  SignInForm,
  type SignInFormValues,
} from '@/features/authentication/components/sign-in-form';

import { useNavigate } from 'react-router';
import { HOME_PATH } from '@/constants/paths';
import { HttpError } from '@/data/http/http-error';
import { toast } from '@/features/shared/ui/sonner';
import type { ErrorResponse } from '@workspace/shared';
import { Card, CardContent } from '@/features/shared/ui/card';
import { useSignIn } from '@/features/authentication/hooks/use-sign-in';

export const SignInScreen = () => {
  const navigate = useNavigate();
  const signIn = useSignIn();

  const handleOnSignIn = async (params: SignInFormValues) => {
    try {
      await signIn.mutateAsync(params);

      toast.success('Signed in successfully!');

      navigate(HOME_PATH);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error instanceof HttpError) {
        const errorResponse: ErrorResponse = await error.response.json();

        if (errorResponse.message) {
          errorMessage = errorResponse.message;
        }
      }

      toast.error(errorMessage);
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
