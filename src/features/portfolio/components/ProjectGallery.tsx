import { ChevronLeft, ChevronRight } from "lucide-react";
import { useId, useRef, useState } from "react";
import type { SwiperClass } from "swiper/react";
import { Button } from "@/shared/ui/Button";
import type { PortfolioProject } from "../model/PortfolioProjects";
import { ProjectGalleryDialog } from "./ProjectGalleryDialog";
import { ProjectPhotoSlider } from "./ProjectPhotoSlider";

interface ProjectGalleryProps {
  project: PortfolioProject;
}

const thumbnailsPerRow = 4;
const formatPhotoNumber = (number: number) => String(number).padStart(2, "0");
const arrowClass = "size-9! shrink-0 p-0! text-text-secondary shadow-xs";

export function ProjectGallery({ project }: ProjectGalleryProps) {
  const galleryId = useId();
  const swiperRef = useRef<SwiperClass>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const photoCount = project.photos.length;
  const firstThumbnail =
    Math.floor(activeIndex / thumbnailsPerRow) * thumbnailsPerRow;
  const thumbnails = project.photos.slice(
    firstThumbnail,
    firstThumbnail + thumbnailsPerRow,
  );
  const selectPhoto = (index: number) => swiperRef.current?.slideTo(index);

  return (
    <section
      aria-label={`Фотографии проекта «${project.title}»`}
      aria-roledescription="карусель"
      className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-8px bg-background-subtle l:col-span-7 l:flex l:flex-col l:gap-32px l:border-r l:border-border-default l:p-32px"
    >
      <div className="relative isolate col-span-full row-start-1 overflow-hidden bg-background-inverse l:my-auto l:rounded-lg l:shadow-md">
        <ProjectPhotoSlider
          id={galleryId}
          photos={project.photos}
          activeIndex={activeIndex}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onIndexChange={setActiveIndex}
        />

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background-inverse/70 via-transparent to-black/20" />
      </div>

      <div className="contents l:flex l:flex-wrap l:items-center l:justify-between l:gap-12px l:pt-12px">
        <div
          role="group"
          aria-label="Миниатюры фотографий"
          className="col-start-1 row-start-2 flex flex-wrap items-center gap-ui-gutter max-l:pb-12px max-l:pl-12px sm:gap-ui-inset"
        >
          {thumbnails.map(({ image, alt }, offset) => {
            const index = firstThumbnail + offset;
            return (
              <Button
                key={index}
                variant="outline"
                size="small"
                aria-label={`Фото ${index + 1}: ${alt}`}
                aria-controls={galleryId}
                aria-current={index === activeIndex}
                onClick={() => selectPhoto(index)}
                className="relative size-11! overflow-hidden p-0! shadow-xs after:pointer-events-none after:absolute after:inset-0 after:rounded-ui-control after:inset-ring after:inset-ring-border-default aria-current:after:inset-ring-2 aria-current:after:inset-ring-border-accent sm:size-14!"
              >
                <img
                  src={image.src}
                  width={image.width}
                  height={image.height}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover"
                />
              </Button>
            );
          })}
        </div>

        <div className="contents l:flex l:flex-wrap l:items-center l:gap-12px">
          <div className="col-start-2 row-start-2 flex items-center gap-ui-gutter max-l:pr-12px max-l:pb-12px l:order-2">
            <Button
              variant="outline"
              size="small"
              aria-label="Предыдущее фото"
              aria-controls={galleryId}
              disabled={photoCount < 2}
              className={arrowClass}
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="small"
              aria-label="Следующее фото"
              aria-controls={galleryId}
              disabled={photoCount < 2}
              className={arrowClass}
              onClick={() => swiperRef.current?.slideNext()}
            >
              <ChevronRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
          <div className="z-10 col-span-full row-start-1 mr-12px mb-12px flex items-center self-end justify-self-end rounded-ui-control bg-background-inverse/85 text-text-inverse backdrop-blur-md l:contents">
            <span
              role="status"
              className="pl-12px text-desktop-caption-semi-bold tabular-nums l:order-1 l:rounded-ui-control l:border l:border-border-default l:bg-background-base l:px-3 l:py-ui-gutter l:text-text-primary l:shadow-xs"
            >
              <span className="sr-only">
                Фото {activeIndex + 1} из {photoCount}
              </span>
              <span aria-hidden="true">
                {formatPhotoNumber(activeIndex + 1)} /{" "}
                {formatPhotoNumber(photoCount)}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="pl-ui-gutter text-desktop-caption-semi-bold l:hidden"
            >
              •
            </span>
            <ProjectGalleryDialog
              project={project}
              activeIndex={activeIndex}
              onSelectPhoto={selectPhoto}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
