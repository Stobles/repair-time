import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { Icon, type IconName } from "../Icon";

const buttonVariants = cva(
  "ui-focus inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-ui-control select-none motion-safe:transition-colors motion-safe:duration-300 disabled:cursor-not-allowed disabled:bg-button-disabled disabled:text-text-muted",
  {
    variants: {
      variant: {
        primary:
          "bg-button-primary text-text-inverse not-disabled:hover:bg-button-primary-hover not-disabled:active:bg-button-primary-active not-disabled:active:shadow-ui-button-primary",
        outline:
          "bg-button-outline text-text-primary inset-ring-1 inset-ring-border-default not-disabled:hover:bg-button-outline-hover not-disabled:active:bg-button-outline-active not-disabled:active:inset-ring-border-strong not-disabled:active:shadow-ui-button-outline disabled:inset-ring-0",
        dark: "bg-background-inverse text-text-inverse not-disabled:hover:bg-button-dark-hover not-disabled:active:bg-button-dark-active not-disabled:active:shadow-ui-button-dark",
      },
      size: {
        large:
          "h-ui-button-large gap-ui-inset px-ui-wide-inset py-16px text-button-large",
        medium: "h-ui-button-medium gap-8px px-24px py-12px text-button-medium",
        small:
          "h-ui-button-small gap-ui-gutter px-16px py-8px text-button-small",
      },
    },
    defaultVariants: { variant: "primary", size: "large" },
  },
);

type ButtonIconChoice = boolean | IconName | ReactElement;

type ButtonElementProps = Omit<ComponentProps<"button">, "children">;

type ButtonProps = VariantProps<typeof buttonVariants> & {
  leftIcon?: ButtonIconChoice;
  rightIcon?: ButtonIconChoice;
  className?: string;
} & (
    | (ButtonElementProps & {
        asChild?: false;
        href?: never;
        children: ReactNode;
      })
    | (ButtonElementProps & {
        asChild: true;
        href?: never;
        children: ReactElement;
        disabled?: never;
      })
    | (ComponentProps<"a"> & {
        href: string;
        asChild?: never;
        children: ReactNode;
      })
  );

function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "large",
    leftIcon = false,
    rightIcon = false,
    className,
    ...elementProps
  } = props;
  const left = leftIcon && <ButtonIcon>{leftIcon}</ButtonIcon>;
  const right = rightIcon && <ButtonIcon>{rightIcon}</ButtonIcon>;
  const styleProps = {
    "data-slot": "button",
    "data-variant": variant,
    "data-size": size,
    className: cn(buttonVariants({ variant, size, className })),
  };

  if (elementProps.href !== undefined) {
    const { asChild, children, ...linkProps } = elementProps;
    return (
      <a {...linkProps} {...styleProps}>
        {left}
        {children}
        {right}
      </a>
    );
  }

  const {
    asChild,
    children,
    href,
    type = "button",
    ...buttonProps
  } = elementProps;
  if (asChild) {
    return (
      <Slot.Root {...buttonProps} {...styleProps}>
        {left}
        <Slot.Slottable>{children}</Slot.Slottable>
        {right}
      </Slot.Root>
    );
  }

  return (
    <button {...buttonProps} {...styleProps} type={type}>
      {left}
      {children}
      {right}
    </button>
  );
}

function ButtonIcon({
  children,
}: {
  children: Exclude<ButtonIconChoice, false>;
}) {
  return (
    <span
      aria-hidden="true"
      className="grid size-ui-button-icon shrink-0 place-items-center [&>svg]:size-full"
    >
      {typeof children === "object" ? (
        children
      ) : (
        <Icon name={children === true ? "arrow-right" : children} />
      )}
    </span>
  );
}

export { Button, buttonVariants, type ButtonProps };
