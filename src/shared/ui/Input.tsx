import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

function Input({ className, type = "text", ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "ui-field-surface h-ui-field px-16px text-placeholder placeholder:text-text-tertiary",
        className
      )}
      {...props}
    />
  );
}

export { Input };
