import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "ui-field-surface min-h-ui-textfield resize-y px-16px py-12px text-placeholder placeholder:text-text-tertiary",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
