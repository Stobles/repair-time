import { useId, useState } from "react";
import type { PortfolioProject } from "../model/PortfolioProjects";
import { ProjectDetails } from "./ProjectDetails";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectPreviews } from "./ProjectPreviews";

interface ProjectShowcaseProps {
  projects: readonly PortfolioProject[];
}

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const [selectedId, setSelectedId] = useState(projects[0]?.id);
  const showcaseId = useId();
  const titleId = useId();
  const project = projects.find(({ id }) => id === selectedId) ?? projects[0];

  if (!project) return null;

  return (
    <div className="grid min-w-0 gap-16px l:gap-32px">
      <ProjectPreviews
        projects={projects}
        selectedId={project.id}
        showcaseId={showcaseId}
        onSelect={setSelectedId}
      />
      <p className="sr-only" role="status">{project.title}</p>
      <article
        id={showcaseId}
        aria-labelledby={titleId}
        className="grid overflow-hidden rounded-xl border border-border-default bg-background-base shadow-sm l:grid-cols-12 l:shadow-xl"
      >
        <ProjectGallery key={project.id} project={project} />
        <ProjectDetails
          project={project}
          titleId={titleId}
        />
      </article>
    </div>
  );
}
