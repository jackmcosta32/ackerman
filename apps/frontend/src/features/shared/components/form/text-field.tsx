import {
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  useFormField,
  FormDescription,
} from '@/features/shared/ui/form';

import { Input } from '@/features/shared/ui/input';
import { CheckIcon, OctagonAlertIcon } from 'lucide-react';

export interface TextFieldProps extends React.ComponentProps<typeof Input> {
  name: string;
  hideStatus?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  showFormMessage?: boolean;
}

export const TextField = ({
  name,
  label,
  children,
  className,
  hideStatus,
  description,
  placeholder,
  showFormMessage = true,
  ...rest
}: TextFieldProps) => {
  const formField = useFormField();

  return (
    <FormField
      name={name}
      control={formField.control}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <Input
              {...rest}
              value={field.value ?? ''}
              onChange={field.onChange}
              placeholder={placeholder}
              data-hide-status={hideStatus}
            >
              {fieldState.isDirty && !hideStatus && (
                <span className="flex items-center pr-3">
                  {fieldState.invalid ? (
                    <OctagonAlertIcon size={14} className="text-destructive" />
                  ) : (
                    <CheckIcon size={14} className="text-success" />
                  )}
                </span>
              )}

              {children}
            </Input>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}

          {showFormMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
};
