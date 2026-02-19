import {
  useSignUp,
  SIGN_UP_PROVIDER,
} from '@/features/authentication/hooks/use-sign-up';

import {
  SignUpForm,
  type SignUpFormValues,
} from '@/features/authentication/components/sign-up-form';

import { useNavigate } from 'react-router';
import { SIGN_IN_PATH } from '@/constants/paths';
import { HttpError } from '@/data/http/http-error';
import { toast } from '@/features/shared/ui/sonner';
import type { ErrorResponse } from '@workspace/shared';
import { Card, CardContent } from '@/features/shared/ui/card';

export const SignUpScreen = () => {
  const navigate = useNavigate();
  const signUp = useSignUp();

  const handleOnSignUp = async (params: SignUpFormValues) => {
    try {
      await signUp.mutateAsync({
        ...params,
        provider: SIGN_UP_PROVIDER.LOCAL,
      });

      toast.success('Account created successfully!');

      navigate(SIGN_IN_PATH);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error instanceof HttpError) {
        const errorResponse: ErrorResponse = await error.response.json();

        if (errorResponse.message) {
          if (Array.isArray(errorResponse.message)) {
            errorMessage = errorResponse.message.join(', ');
          } else {
            errorMessage = errorResponse.message;
          }
        }
      }

      toast.error(errorMessage);
    }
  };

  return (
    <Card className="max-w-sm w-full m-4">
      <CardContent>
        <SignUpForm onValid={handleOnSignUp} isLoading={signUp.isPending} />
      </CardContent>
    </Card>
  );
};
