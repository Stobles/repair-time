import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/Dialog";

interface EstimateButtonProps {
  label?: string;
  wideLabel?: string;
  title?: string;
  description?: string;
  size?: ButtonProps["size"];
  leftIcon?: ButtonProps["leftIcon"];
  rightIcon?: ButtonProps["rightIcon"];
  className?: string;
  children: ReactNode;
}

function EstimateButton({
  label = "ОБРАТНЫЙ ЗВОНОК",
  title = "Заказать обратный звонок",
  description = "Укажите номер телефона и расскажите, какой ремонт планируете.",
  size = "small",
  leftIcon = "calculator",
  rightIcon = false,
  className,
  children,
}: EstimateButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={size}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          className={className}
        >
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export { EstimateButton };
