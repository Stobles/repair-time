import { Keyboard, Zoom } from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import { cn } from "@/shared/lib/utils/cn";
import type { ProjectPhoto } from "../model/PortfolioProjects";

interface ProjectPhotoSliderProps {
  id: string;
  photos: readonly ProjectPhoto[];
  activeIndex: number;
  initialIndex?: number;
  expanded?: boolean;
  onSwiper: (swiper: SwiperClass) => void;
  onIndexChange: (index: number) => void;
  onZoomChange?: (scale: number) => void;
}

export const maxPhotoZoom = 3;

export function ProjectPhotoSlider({
  id,
  photos,
  activeIndex,
  initialIndex = 0,
  expanded = false,
  onSwiper,
  onIndexChange,
  onZoomChange,
}: ProjectPhotoSliderProps) {
  return (
    <Swiper
      id={id}
      className={cn(
        "min-w-0 touch-pan-y overflow-hidden [&>.swiper-wrapper]:flex [&>.swiper-wrapper]:items-center [&>.swiper-wrapper]:transition-transform",
        expanded &&
          "h-[min(74dvh,110vw,calc(100dvh-12rem),44rem)] min-h-24 rounded-lg bg-background-inverse [&>.swiper-wrapper]:h-full",
      )}
      modules={expanded ? [Keyboard, Zoom] : undefined}
      keyboard={expanded && { enabled: true, pageUpDown: false }}
      zoom={expanded && { maxRatio: maxPhotoZoom }}
      initialSlide={initialIndex}
      rewind
      onBeforeInit={(swiper) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          swiper.params.speed = 0;
        }
      }}
      onSwiper={onSwiper}
      onSlideChange={(swiper) => {
        if (expanded && swiper.zoom.scale > 1) swiper.zoom.out();
        onIndexChange(swiper.realIndex);
      }}
      onZoomChange={(swiper, scale) => {
        swiper.allowTouchMove = scale === 1;
        onZoomChange?.(scale);
      }}
    >
      {photos.map(({ image, alt }, index) => (
        <SwiperSlide
          key={index}
          role="group"
          aria-roledescription="слайд"
          aria-label={`${index + 1} из ${photos.length}`}
          aria-hidden={activeIndex !== index}
          zoom={expanded}
          className={cn(
            "w-full shrink-0 select-none",
            expanded
              ? "h-full cursor-zoom-in overflow-hidden [&.swiper-slide-zoomed]:cursor-move [&.swiper-slide-zoomed]:touch-none [&>.swiper-zoom-container]:flex [&>.swiper-zoom-container]:size-full [&>.swiper-zoom-container]:items-center [&>.swiper-zoom-container]:justify-center motion-reduce:[&>.swiper-zoom-container]:transition-none"
              : "aspect-[5/4] sm:max-l:aspect-[2/1] l:aspect-[4/3]",
          )}
        >
          <img
            src={image.src}
            width={image.width}
            height={image.height}
            alt={alt}
            loading={expanded && index === activeIndex ? "eager" : "lazy"}
            draggable={false}
            className={cn(
              "block w-full object-center",
              expanded
                ? "h-auto max-h-full object-contain motion-reduce:transition-none"
                : "h-full object-cover",
            )}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
