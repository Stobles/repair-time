import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils/cn";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { CheckIcon } from "lucide-react";

function Checkbox({
  className,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer ui-focus relative grid size-ui-checkbox shrink-0 cursor-pointer place-items-center rounded-sm border border-border-default bg-background-base data-checked:border-transparent data-checked:bg-background-accent data-checked:text-text-inverse aria-invalid:border-error aria-invalid:focus-visible:outline-error disabled:cursor-not-allowed forced-colors:data-checked:border-[Highlight] forced-colors:data-checked:text-[Highlight]",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
      >
        <CheckIcon aria-hidden="true" focusable="false" className="size-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
