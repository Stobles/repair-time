import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

function Dialog(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal(props: ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose(props: ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-background-inverse/60 backdrop-blur-md motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

interface DialogContentProps extends ComponentProps<
  typeof DialogPrimitive.Content
> {
  size?: "default" | "wide";
  showCloseButton?: boolean;
  closeLabel?: string;
}

function DialogContent({
  className,
  size = "default",
  children,
  showCloseButton = true,
  closeLabel = "Закрыть",
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-var(--spacing-32px))] w-[calc(100%-var(--spacing-32px))] -translate-x-1/2 -translate-y-1/2 overflow-auto overscroll-contain rounded-2xl border border-background-inactive bg-background-base text-text-primary shadow-ui-dialog outline-none motion-safe:duration-200 motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=closed]:zoom-out-95",
          size === "wide" ? "max-w-6xl" : "max-w-ui-dialog",
          className,
        )}
        {...props}
      >
        <div
          aria-hidden="true"
          className="h-8px bg-linear-to-r from-background-accent via-ui-dialog-accent-middle to-ui-dialog-accent-end"
        />
        <div className={cn(
          "grid",
          size === "wide" ? "gap-12px p-12px sm:p-16px" : "gap-24px p-[clamp(1rem,7vw,var(--spacing-48px))]",
        )}>
          {children}
        </div>
        {showCloseButton && (
          <DialogClose className="ui-focus absolute end-5 top-5 grid size-10 cursor-pointer place-items-center rounded-full bg-background-inactive text-text-tertiary">
            <X aria-hidden="true" className="size-4" />
            <span className="sr-only">{closeLabel}</span>
          </DialogClose>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("grid gap-12px pe-48px", className)}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-desktop-h3 text-background-inverse", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-desktop-body-large text-text-tertiary", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
