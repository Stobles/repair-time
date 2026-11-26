import { Button } from "@/shared/ui/Button";
import type { PortfolioProject } from "../model/PortfolioProjects";

interface ProjectDetailsProps {
  project: PortfolioProject;
  titleId: string;
  whatsappUrl: string;
}

export function ProjectDetails({
  project,
  titleId,
}: ProjectDetailsProps) {
  const { badge, specifications } = project;

  return (
    <div className="flex min-w-0 flex-col gap-16px p-16px sm:max-l:p-5 l:col-span-5 l:gap-24px l:p-32px">
      <header className="grid gap-8px l:gap-12px l:pb-8px">
        {badge && (
          <p className="flex items-center gap-8px text-tablet-title-extra-small text-text-accent uppercase l:text-desktop-title-extra-small">
            <span
              aria-hidden="true"
              className="size-8px shrink-0 rounded-full bg-background-accent"
            />
            {badge}
          </p>
        )}
        <h3
          id={titleId}
          className="text-mobile-h3 sm:max-l:text-tablet-h3 l:max-w-sm l:text-desktop-h3"
        >
          {project.title}
        </h3>
        <p className="text-tablet-body-medium text-text-tertiary l:text-desktop-body-medium">
          {project.description}
        </p>
      </header>

      {specifications.length > 0 && (
        <dl className="grid grid-cols-2 gap-8px max-sm:gap-y-12px l:gap-x-12px l:gap-y-3.5">
          {specifications.map(({ label, value, highlight }, index) => (
            <div
              key={index}
              className={`grid content-start gap-1 rounded-sm border p-2.5 sm:rounded-lg l:px-3.5 l:py-3.5 ${
                highlight
                  ? "border-border-accent-subtle bg-background-accent-subtle text-text-accent-dark l:border-transparent"
                  : "border-transparent bg-background-subtle sm:border-border-default"
              }`}
            >
              <dt
                className={`text-tablet-caption-semi-bold uppercase! l:text-desktop-caption-semi-bold ${highlight ? "" : "text-text-tertiary"}`}
              >
                {label}
              </dt>
              <dd
                className={`text-tablet-title-small l:text-desktop-title-small ${highlight ? "text-text-accent" : ""}`}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-auto grid gap-12px l:border-t l:border-background-inactive l:pt-16px">
        <Button
          href="#contacts"
          leftIcon="phone"
          className="h-auto min-h-12 w-full px-12px py-12px text-center whitespace-normal l:min-h-ui-button-large"
        >
          ОБСУДИТЬ ПОХОЖИЙ ПРОЕКТ
        </Button>
      </div>
    </div>
  );
}
