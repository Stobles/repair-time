import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/Dialog";
import type { Review } from "../types/Review";

type ReviewQuoteProps = Pick<Review, "author" | "details" | "quote">;

const quoteTextClass = "wrap-anywhere whitespace-pre-line";

function ReviewQuote({ author, details, quote }: ReviewQuoteProps) {
  const excerptRef = useRef<HTMLParagraphElement>(null);
  const fullTextRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const excerpt = excerptRef.current;
    const fullText = fullTextRef.current;
    if (!excerpt || !fullText) return;

    const measure = () => setIsTruncated(fullText.offsetHeight > excerpt.offsetHeight);
    const observer = new ResizeObserver(measure);
    observer.observe(excerpt);
    observer.observe(fullText);
    measure();

    return () => observer.disconnect();
  }, []);

  return (
    <div className="col-span-full min-w-0 max-sm:pb-px">
      <blockquote className="text-tablet-body-large text-text-tertiary max-sm:pe-3.5 sm:max-l:text-tablet-body-medium l:text-desktop-body-medium">
        <div className="relative overflow-clip">
          <p
            ref={excerptRef}
            tabIndex={-1}
            className={`${quoteTextClass} line-clamp-6 [@media(scripting:none)]:line-clamp-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-accent`}
          >
            {quote}
          </p>
          <p
            ref={fullTextRef}
            aria-hidden="true"
            className={`${quoteTextClass} invisible absolute inset-x-0 top-0`}
          >
            {quote}
          </p>
        </div>
      </blockquote>

      <Dialog>
        {isTruncated && (
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="small"
              leftIcon={false}
              rightIcon="arrow-right"
              className="mt-12px text-text-accent-dark"
              aria-label={`Читать полностью — ${author}`}
            >
              Читать полностью
            </Button>
          </DialogTrigger>
        )}
        <DialogContent
          className="max-w-xl"
          onOpenAutoFocus={(event) => {
            if (!titleRef.current) return;
            event.preventDefault();
            titleRef.current.focus();
          }}
          onCloseAutoFocus={(event) => {
            if (isTruncated) return;
            event.preventDefault();
            excerptRef.current?.focus({ preventScroll: true });
          }}
        >
          <DialogHeader className="gap-ui-gutter">
            <DialogTitle
              ref={titleRef}
              tabIndex={-1}
              className="text-mobile-h3 wrap-anywhere outline-none l:text-desktop-h3"
            >
              {author}
            </DialogTitle>
            <DialogDescription className="text-desktop-body-medium wrap-anywhere">
              {details}
            </DialogDescription>
          </DialogHeader>

          <blockquote className="rounded-e-lg border-s-2 border-border-accent bg-background-subtle p-16px text-desktop-body-regular text-text-secondary sm:p-24px sm:text-desktop-body-large">
            <p className={quoteTextClass}>{quote}</p>
          </blockquote>

          <DialogClose asChild>
            <Button variant="outline" size="small" leftIcon={false} rightIcon={false} className="justify-self-start">
              Закрыть
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { ReviewQuote };
