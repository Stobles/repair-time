import { ChevronRight, Menu, X } from "lucide-react";
import { Popover } from "radix-ui";
import { useRef } from "react";
import type { CallbackFormProps } from "@/features/contacts";
import { Button } from "@/shared/ui/Button";
import { EstimateButton } from "./EstimateButton";

interface HeaderLink {
  id: string;
  label: string;
}

interface HeaderMenuProps {
  callbackForm: CallbackFormProps;
  links: readonly HeaderLink[];
  phone: string;
  telegramUrl: string;
  schedule: string;
  license: string;
}

function HeaderMenu({
  callbackForm,
  links,
  phone,
  telegramUrl,
  schedule,
  license,
}: HeaderMenuProps) {
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`;
  const firstLink = useRef<HTMLAnchorElement>(null);

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="Меню"
        className="group ui-focus grid size-11 shrink-0 cursor-pointer place-items-center rounded-md border border-border-default text-background-inverse l:hidden"
      >
        <Menu
          aria-hidden="true"
          className="size-5 group-data-[state=open]:hidden"
        />
        <X
          aria-hidden="true"
          className="hidden size-5 group-data-[state=open]:block"
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={10}
          onOpenAutoFocus={(event) => {
            if (!firstLink.current) return;
            event.preventDefault();
            firstLink.current.focus();
          }}
          className="z-40 max-h-full w-dvw max-w-(--radix-popover-content-available-width) overflow-auto border-t border-border-default bg-background-subtle shadow-xs l:hidden"
        >
          <nav
            aria-label="Разделы сайта"
            className="mx-auto max-w-content-tablet px-gutter-mobile sm:px-gutter-tablet"
          >
            <ul className="pt-8px">
              {links.map(({ id, label }, index) => (
                <li key={id} className="border-b border-border-default">
                  <Popover.Close asChild>
                    <a
                      ref={index === 0 ? firstLink : undefined}
                      href={`#${id}`}
                      className="ui-focus flex min-h-48px items-center justify-between gap-8px rounded-sm py-12px text-tablet-title-large text-text-primary hover:text-text-accent-dark"
                    >
                      {label}
                      <ChevronRight
                        aria-hidden="true"
                        className="size-3 shrink-0 text-text-tertiary"
                      />
                    </a>
                  </Popover.Close>
                </li>
              ))}
            </ul>
            <div className="grid gap-16px pt-32px pb-24px">
              <EstimateButton
                label="Рассчитать стоимость"
                size="medium"
                leftIcon={false}
                rightIcon
                contact={{ phone, telegramUrl, callbackForm }}
                className="min-h-48px w-full"
              />
              <div className="grid justify-items-center gap-4px">
                <a
                  href={phoneHref}
                  className="ui-focus rounded-sm text-mobile-h3 text-text-primary hover:text-text-accent-dark"
                >
                  {phone}
                </a>
                <p className="text-tablet-caption-semi-bold text-text-tertiary">
                  {schedule}
                </p>
                <p className="text-desktop-caption-medium text-text-tertiary sm:hidden">
                  {license}
                </p>
              </div>
              <Button
                href={telegramUrl}
                target="_blank"
                rel="noopener"
                size="medium"
                variant="outline"
                leftIcon="send"
                rightIcon={false}
              >
                Написать в Telegram
              </Button>
            </div>
          </nav>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export { HeaderMenu, type HeaderLink };
