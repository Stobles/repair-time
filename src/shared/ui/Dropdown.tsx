import { ChevronDown } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { cn } from "@/shared/lib/utils";

interface DropdownOption {
  value: string;
  label: string;
}

type DropdownProps = Omit<
  ComponentProps<typeof DropdownMenu.Root>,
  "children" | "modal"
> & {
  id: string;
  label: string;
  options: readonly DropdownOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  form?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  describedBy?: string;
  className?: string;
};

function Dropdown({
  id,
  label,
  options,
  value,
  defaultValue = "",
  onValueChange,
  name,
  form,
  required,
  disabled,
  placeholder,
  describedBy,
  className,
  ...props
}: DropdownProps) {
  const [localValue, setLocalValue] = useState(defaultValue);
  const [validationMessage, setValidationMessage] = useState("");
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const fieldRef = useRef<HTMLSelectElement>(null);
  const selectedValue = value ?? localValue;
  const selectedLabel = options.find(
    (option) => option.value === selectedValue,
  )?.label;
  const errorId = `${id}-validation`;
  const description =
    [describedBy, validationMessage && errorId].filter(Boolean).join(" ") ||
    undefined;
  const setContainer = useCallback((node: HTMLDivElement | null) => {
    setPortalContainer(
      node?.closest<HTMLElement>('[data-slot="dialog-content"]') ?? null,
    );
  }, []);

  useEffect(() => {
    const formElement = fieldRef.current?.form;
    if (!formElement) return;

    function reset() {
      setLocalValue(defaultValue);
      setValidationMessage("");
    }

    formElement.addEventListener("reset", reset);
    return () => formElement.removeEventListener("reset", reset);
  }, [form, defaultValue, name, required]);

  function select(nextValue: string) {
    if (value === undefined) setLocalValue(nextValue);
    setValidationMessage("");
    onValueChange?.(nextValue);
  }

  return (
    <div
      ref={setContainer}
      className={cn("grid min-w-0 gap-ui-gutter", className)}
    >
      <label id={`${id}-label`} htmlFor={id} className="ui-field-label">
        {label}
        {required && (
          <span className="text-text-accent" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      <DropdownMenu.Root {...props} modal={false}>
        <DropdownMenu.Trigger
          ref={triggerRef}
          id={id}
          disabled={disabled}
          aria-labelledby={`${id}-label ${id}-value`}
          aria-describedby={description}
          aria-invalid={Boolean(validationMessage) || undefined}
          className="ui-field-surface flex h-ui-field cursor-pointer items-center justify-between gap-8px ps-16px pe-8px text-desktop-body-medium"
        >
          <span
            id={`${id}-value`}
            className={cn("truncate", !selectedLabel && "text-text-tertiary")}
          >
            {selectedLabel ?? placeholder}
          </span>
          <ChevronDown
            aria-hidden="true"
            className="size-ui-dropdown-icon shrink-0"
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal container={portalContainer ?? undefined}>
          <DropdownMenu.Content
            sideOffset={6}
            align="start"
            collisionPadding={8}
            className="z-10 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) max-w-(--radix-dropdown-menu-content-available-width) origin-(--radix-dropdown-menu-content-transform-origin) overflow-y-auto rounded-ui-control bg-background-base px-[calc(var(--spacing-ui-inset)+1px)] pt-px inset-ring-1 inset-ring-border-strong motion-safe:data-[state=open]:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-150 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=top]:slide-in-from-bottom-2"
          >
            <DropdownMenu.RadioGroup
              value={selectedValue}
              onValueChange={select}
            >
              {options.map(({ value, label }) => (
                <DropdownMenu.RadioItem
                  key={value}
                  value={value}
                  className="flex min-h-ui-dropdown-option cursor-pointer items-center px-16px py-12px text-desktop-body-medium leading-(--text-desktop-body-regular--line-height) text-text-primary not-last:border-b not-last:border-border-strong data-highlighted:outline-2 data-highlighted:-outline-offset-2 data-highlighted:outline-text-accent-dark"
                >
                  {label}
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      {(name || required) && (
        <select
          ref={fieldRef}
          aria-hidden="true"
          tabIndex={-1}
          className="sr-only"
          name={name}
          form={form}
          disabled={disabled}
          required={required}
          value={selectedValue}
          onChange={(event) => select(event.currentTarget.value)}
          onInvalid={(event) => {
            event.preventDefault();
            setValidationMessage(event.currentTarget.validationMessage);
            triggerRef.current?.focus();
          }}
        >
          <option value="" />
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      )}
      {validationMessage && (
        <p
          id={errorId}
          role="alert"
          className="text-desktop-caption-medium text-text-accent-dark"
        >
          {validationMessage}
        </p>
      )}
    </div>
  );
}

export { Dropdown, type DropdownOption, type DropdownProps };
