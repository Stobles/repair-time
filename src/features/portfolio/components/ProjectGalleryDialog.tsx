import { ChevronLeft, ChevronRight, Images, ZoomIn, ZoomOut } from "lucide-react";
import { useId, useRef, useState } from "react";
import type { SwiperClass } from "swiper/react";
import { Button } from "@/shared/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/Dialog";
import type { PortfolioProject } from "../model/PortfolioProjects";
import { maxPhotoZoom, ProjectPhotoSlider } from "./ProjectPhotoSlider";

interface ProjectGalleryDialogProps {
  project: PortfolioProject;
  activeIndex: number;
  onSelectPhoto: (index: number) => void;
}

const zoomStep = 0.5;
const zoomButtonClass = "size-11! p-0! aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:bg-button-outline";

export function ProjectGalleryDialog({ project, activeIndex, onSelectPhoto }: ProjectGalleryDialogProps) {
  const galleryId = useId();
  const swiperRef = useRef<SwiperClass>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const photoCount = project.photos.length;
  const photoNumber = String(activeIndex + 1).padStart(String(photoCount).length, "0");

  function changeZoom(amount: number) {
    const zoom = swiperRef.current?.zoom;
    if (!zoom) return;

    const nextScale = Math.min(maxPhotoZoom, Math.max(1, zoom.scale + amount));
    if (nextScale === zoom.scale) return;
    if (nextScale === 1) zoom.out();
    else zoom.in(nextScale);
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        const zoom = swiperRef.current?.zoom;
        if (!open && zoom && zoom.scale > 1) zoom.out();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="small"
          className="h-9 gap-ui-gutter px-3! text-desktop-caption-semi-bold max-l:bg-transparent max-l:text-text-inverse max-l:inset-ring-0 max-l:not-disabled:hover:bg-background-base/15 l:order-3 l:shadow-xs"
        >
          <Images aria-hidden="true" className="size-3.5 l:text-text-accent" />
          ВСЕ ФОТО ({photoCount})
        </Button>
      </DialogTrigger>
      <DialogContent size="wide" aria-describedby={undefined}>
        <DialogTitle className="flex min-h-10 items-center pe-48px text-mobile-h3 wrap-anywhere sm:text-tablet-h3">
          {project.title}
        </DialogTitle>
        <section aria-label="Фотографии проекта" aria-roledescription="карусель" className="grid min-w-0 gap-12px">
          <ProjectPhotoSlider
            id={galleryId}
            photos={project.photos}
            activeIndex={activeIndex}
            initialIndex={activeIndex}
            expanded
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            onIndexChange={onSelectPhoto}
            onZoomChange={setZoomScale}
          />
          <div className="flex flex-wrap items-center justify-center gap-12px sm:gap-16px">
            {photoCount > 1 && (
              <Button
                variant="outline"
                size="small"
                aria-label="Предыдущее фото"
                aria-controls={galleryId}
                className="size-11! p-0!"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
              </Button>
            )}
            <div role="group" aria-label="Масштаб фото" className="flex items-center gap-8px">
              <Button
                variant="outline"
                size="small"
                aria-label="Уменьшить фото"
                aria-controls={galleryId}
                aria-disabled={zoomScale <= 1}
                className={zoomButtonClass}
                onClick={() => changeZoom(-zoomStep)}
              >
                <ZoomOut aria-hidden="true" className="size-5" />
              </Button>
              <Button
                variant="outline"
                size="small"
                aria-label="Увеличить фото"
                aria-controls={galleryId}
                aria-disabled={zoomScale >= maxPhotoZoom}
                className={zoomButtonClass}
                onClick={() => changeZoom(zoomStep)}
              >
                <ZoomIn aria-hidden="true" className="size-5" />
              </Button>
            </div>
            <span role="status" className="text-desktop-caption-semi-bold tabular-nums">
              <span className="sr-only">Фото {activeIndex + 1} из {photoCount}</span>
              <span aria-hidden="true">{photoNumber} / {photoCount}</span>
            </span>
            {photoCount > 1 && (
              <Button
                variant="outline"
                size="small"
                aria-label="Следующее фото"
                aria-controls={galleryId}
                className="size-11! p-0!"
                onClick={() => swiperRef.current?.slideNext()}
              >
                <ChevronRight aria-hidden="true" className="size-5" />
              </Button>
            )}
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
