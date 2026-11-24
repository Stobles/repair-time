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

interface DirectusPropertyType {
  id: string;
  name: string;
  sort: number;
  is_active: boolean;
}

interface DirectusCallbackRequest {
  id: string;
  date_created: string;
  name: string;
  phone: string;
  property: string | DirectusPropertyType;
  message: string;
}

export interface DirectusSchema {
  directus_files: DirectusFile[];
  hero_slides: DirectusHeroSlide[];
  property_types: DirectusPropertyType[];
  callback_requests: DirectusCallbackRequest[];
}
