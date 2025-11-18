import {
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  useFormField,
  FormDescription,
} from '@/features/shared/ui/form';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/features/shared/ui/input';
import { Button } from '@/features/shared/ui/button';

export interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  hideFormMessage?: boolean;
}

export const PasswordField = ({
  name,
  label,
  className,
  description,
  placeholder,
  hideFormMessage = false,
  ...rest
}: PasswordFieldProps) => {
  const formField = useFormField();
  const [showPassword, setShowPassword] = useState(false);

  const fieldType = showPassword ? 'text' : 'password';
  const FieldIcon = showPassword ? Eye : EyeOff;

  const toggleFieldType = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormField
      name={name}
      control={formField.control}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <Input
              type={fieldType}
              {...rest}
              value={field.value}
              onChange={field.onChange}
              placeholder={placeholder}
            >
              <Button
                size="icon"
                type="button"
                variant="ghost"
                onClick={toggleFieldType}
              >
                <FieldIcon size={24} />
              </Button>
            </Input>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}

          {!hideFormMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
};
