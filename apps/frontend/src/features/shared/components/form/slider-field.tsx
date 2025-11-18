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
import { cn } from '@/features/shared/utils/style';
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
          <FormControl>
            <Input
              {...rest}
              className={cn(label && 'pt-6 pr-11 h-14 pb-1')}
              onChange={field.onChange}
              placeholder={placeholder}
              value={field.value}
            >
              {label && (
                <FormLabel className="absolute top-2 typography-btn-small">
                  {label}
                </FormLabel>
              )}

              {fieldState.isDirty && !hideStatus && (
                <span className="flex items-center absolute right-4 top-0 bottom-0">
                  {fieldState.invalid ? (
                    <OctagonAlertIcon size={14} className="text-error" />
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
