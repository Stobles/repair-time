import { useEffect, useRef, useState, type ComponentProps } from "react";
import { Field, FieldError, FieldLabel } from "@/shared/ui/Field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";

type SelectFieldProps = Pick<ComponentProps<typeof Select>,
  "name" | "value" | "defaultValue" | "onValueChange" | "required"
> & {
  id: string;
  label: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  triggerRef?: (node: HTMLButtonElement | null) => void;
  onBlur?: ComponentProps<typeof SelectTrigger>["onBlur"];
};

function SelectField({ id, label, options, placeholder, error, triggerRef, onBlur, onValueChange, ...props }: SelectFieldProps) {
  const trigger = useRef<HTMLButtonElement>(null);
  const [nativeError, setNativeError] = useState("");
  const message = error ?? nativeError;
  const errorId = `${id}-error`;

  useEffect(() => {
    const form = trigger.current?.form;
    if (!form || !props.required) return;

    const clearError = () => setNativeError("");
    form.addEventListener("reset", clearError);
    return () => form.removeEventListener("reset", clearError);
  }, [props.required]);

  return (
    <Field
      data-invalid={Boolean(message) || undefined}
      onInvalid={(event) => {
        if (!(event.target instanceof HTMLSelectElement)) return;
        event.preventDefault();
        setNativeError("Выберите значение.");
        trigger.current?.focus();
      }}
    >
      <FieldLabel htmlFor={id}>
        {label}
        {props.required && <span aria-hidden="true" className="text-text-accent">*</span>}
      </FieldLabel>
      <Select {...props} onValueChange={(value) => {
        setNativeError("");
        onValueChange?.(value);
      }}>
        <SelectTrigger
          id={id}
          ref={(node) => {
            trigger.current = node;
            triggerRef?.(node);
          }}
          onBlur={onBlur}
          aria-invalid={Boolean(message) || undefined}
          aria-describedby={message ? errorId : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper" align="start" sideOffset={6} collisionPadding={8}>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {message && <FieldError id={errorId}>{message}</FieldError>}
    </Field>
  );
}

export { SelectField };
