import type { DirectusSchema } from "@/shared/lib/directus/DirectusSchema";

export interface HeroSlide {
  badge?: string;
  title: string;
  description: string;
  image: { src: string; width?: number; height?: number };
  mobileImageSrc?: string;
  alt: string;
}

type DirectusFile = DirectusSchema["directus_files"][number];

export type HeroSlideFields = Pick<
  DirectusSchema["hero_slides"][number],
  "badge" | "title" | "description" | "image_alt"
> & {
  image: Pick<DirectusFile, "id" | "width" | "height">;
  mobile_image: Pick<DirectusFile, "id"> | null;
};
