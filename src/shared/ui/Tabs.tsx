import { Tabs as RadixTabs } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type PanelSlot = `panel${string}`;

interface TabItem {
  value: string;
  label: string;
  content?: ReactNode;
  panel?: PanelSlot;
}

type TabsProps = Pick<
  ComponentProps<typeof RadixTabs.Root>,
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "activationMode"
  | "dir"
  | "className"
> & {
  label: string;
  items: readonly TabItem[];
} & Partial<Record<PanelSlot, ReactNode>>;

function Tabs({
  label,
  items,
  defaultValue = items[0]?.value,
  className,
  ...props
}: TabsProps) {
  const { value, onValueChange, activationMode, dir, ...panelSlots } = props;

  return (
    <RadixTabs.Root
      className={cn("min-w-0", className)}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      activationMode={activationMode}
      dir={dir}
    >
      <RadixTabs.List
        aria-label={label}
        className="flex min-w-0 gap-12px overflow-x-auto"
      >
        {items.map(({ value, label }) => (
          <RadixTabs.Trigger
            key={value}
            value={value}
            className="ui-focus inline-flex min-h-ui-tab shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-background-base px-5 py-ui-inset text-desktop-title-extra-small text-text-secondary inset-ring-1 inset-ring-border-strong focus-visible:-outline-offset-2 data-[state=active]:rounded-ui-tab-active data-[state=active]:bg-background-accent data-[state=active]:text-text-inverse data-[state=active]:inset-ring-0"
          >
            {label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map(({ value, content, panel }) => (
        <RadixTabs.Content key={value} value={value} className="ui-focus">
          {panel ? panelSlots[panel] : content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}

export { Tabs, type TabItem, type TabsProps };
