import { Button } from "@/shared/ui/Button";
import type { PortfolioProject } from "../model/PortfolioProjects";

interface ProjectPreviewsProps {
  projects: readonly PortfolioProject[];
  selectedId: string;
  showcaseId: string;
  onSelect: (id: string) => void;
}

export function ProjectPreviews({ projects, selectedId, showcaseId, onSelect }: ProjectPreviewsProps) {
  return (
    <ul
      aria-label="Превью проектов"
      className="-m-1 grid min-w-0 snap-x snap-proximity auto-cols-[min(78%,17.75rem)] grid-flow-col gap-12px overflow-x-auto p-1 l:auto-cols-auto l:grid-flow-row l:grid-cols-4 l:gap-16px l:overflow-visible"
    >
      {projects.map((project) => {
        const { image } = project.photos[0];

        return (
          <li key={project.id} className="flex min-w-0 snap-start scroll-ms-4px">
            <Button
              variant="outline"
              size="small"
              aria-pressed={project.id === selectedId}
              aria-controls={showcaseId}
              onClick={() => onSelect(project.id)}
              className="h-auto min-h-22 w-full justify-start gap-3.5! rounded-lg! bg-background-subtle px-3.5! py-12px text-left whitespace-normal shadow-xs aria-pressed:bg-background-base aria-pressed:shadow-sm aria-pressed:inset-ring-2 aria-pressed:inset-ring-border-accent"
            >
              <img
                src={image.src}
                width={image.width}
                height={image.height}
                alt=""
                loading="lazy"
                className="size-64px shrink-0 rounded-ui-control object-cover l:max-xl:size-48px"
              />
              <span className="grid min-w-0 flex-1 gap-0.5">
                <span className="flex min-h-10 items-center text-desktop-title-small l:max-w-40">
                  {project.previewTitle}
                </span>
                {project.previewText && (
                  <span className="text-desktop-caption-medium text-text-tertiary">
                    {project.previewText}
                  </span>
                )}
              </span>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
