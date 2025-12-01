import {
  DataForm,
  type DataFormProps,
} from '@/features/shared/components/form/data-form';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Link } from '@/features/shared/ui/link';
import { Button } from '@/features/shared/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@/features/shared/components/form/text-field';
import { PasswordField } from '@/features/shared/components/form/password-field';
import { SIGN_UP_PATH } from '@/constants/paths';

const schema = z.object({
  email: z.email(),
  password: z.string(),
});

export type SignInFormValues = z.infer<typeof schema>;

export interface SignInFormProps
  extends Omit<DataFormProps<SignInFormValues>, 'form'> {
  isLoading?: boolean;
}

export const SignInForm = ({ isLoading, ...rest }: SignInFormProps) => {
  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  return (
    <DataForm form={form} {...rest}>
      <TextField label="E-mail" name="email" autoComplete="username" />

      <PasswordField
        label="Password"
        name="password"
        autoComplete="current-password"
      />

      <Button type="submit" loading={isLoading}>
        Login
      </Button>

      <Button variant="outline" type="button" disabled={isLoading}>
        Forgot your password?
      </Button>

      <Link to={SIGN_UP_PATH}>
        Don't have an account? <span className="underline">Sign up</span>
      </Link>
    </DataForm>
  );
};
