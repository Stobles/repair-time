import { MessageSquareText } from "lucide-react";
import type { ReactNode } from "react";
import { CallbackForm } from "@/features/contacts";
import { Button, type ButtonProps } from "@/shared/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/Dialog";

type EstimateButtonProps = {
  label?: string;
  wideLabel?: string;
  title?: string;
  description?: string;
  size?: ButtonProps["size"];
  leftIcon?: ButtonProps["leftIcon"];
  rightIcon?: ButtonProps["rightIcon"];
  className?: string;
} & (
  | { contact: { phone: string; telegramUrl: string }; children?: never }
  | { contact?: never; children: ReactNode }
);

function EstimateButton({
  label = "ОБРАТНЫЙ ЗВОНОК",
  title = "Заказать обратный звонок",
  description = "Укажите номер телефона и расскажите, какой ремонт планируете.",
  size = "small",
  leftIcon = "calculator",
  rightIcon = false,
  className,
  contact,
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
        {contact ? (
          <>
            <CallbackForm />
            <div className="flex flex-wrap items-center justify-between gap-8px border-t border-border-default pt-16px">
              <a href={contact.telegramUrl} target="_blank" rel="noopener" className="ui-focus flex items-center gap-8px rounded-sm text-desktop-title-extra-small text-functional-telegram hover:underline">
                <MessageSquareText aria-hidden="true" className="size-3 shrink-0" />
                Написать в Telegram
              </a>
              <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="ui-focus rounded-sm text-desktop-title-small text-text-primary hover:text-text-accent-dark">
                {contact.phone}
              </a>
            </div>
          </>
        ) : children}
      </DialogContent>
    </Dialog>
  );
}

export { EstimateButton };
