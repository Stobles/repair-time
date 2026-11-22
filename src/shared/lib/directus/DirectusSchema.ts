interface DirectusFile {
  id: string;
  width: number | null;
  height: number | null;
}

interface DirectusHeroSlide {
  id: string;
  badge: string | null;
  title: string;
  description: string;
  image: string | DirectusFile;
  mobile_image: string | DirectusFile | null;
  image_alt: string;
  status: "draft" | "published" | "archived";
  sort: number | null;
}

export interface DirectusSchema {
  directus_files: DirectusFile[];
  hero_slides: DirectusHeroSlide[];
}
