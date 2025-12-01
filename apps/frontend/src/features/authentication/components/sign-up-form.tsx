import {
  DataForm,
  type DataFormProps,
} from '@/features/shared/components/form/data-form';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Link } from '@/features/shared/ui/link';
import { SIGN_IN_PATH } from '@/constants/paths';
import { Button } from '@/features/shared/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@/features/shared/components/form/text-field';
import { PasswordField } from '@/features/shared/components/form/password-field';

const schema = z
  .object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignUpFormValues = z.infer<typeof schema>;

export interface SignUpFormProps
  extends Omit<DataFormProps<SignUpFormValues>, 'form'> {
  isLoading?: boolean;
}

export const SignUpForm = ({ isLoading, ...rest }: SignUpFormProps) => {
  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  return (
    <DataForm form={form} {...rest}>
      <TextField label="Name" name="name" autoComplete="additional-name" />

      <TextField label="E-mail" name="email" autoComplete="email" />

      <PasswordField
        label="Password"
        name="password"
        autoComplete="new-password"
      />

      <PasswordField
        label="Confirm Password"
        name="confirmPassword"
        autoComplete="new-password"
      />

      <Button type="submit" loading={isLoading}>
        Sign Up
      </Button>

      <Button variant="outline" type="button" disabled={isLoading}>
        Forgot your password?
      </Button>

      <Link to={SIGN_IN_PATH}>
        Already have an account? <span className="underline">Sign in</span>
      </Link>
    </DataForm>
  );
};
