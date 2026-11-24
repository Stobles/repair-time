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

interface DirectusFaqItem {
  id: string;
  question: string;
  answer: string;
  sort: number | null;
}

interface DirectusReview {
  id: string;
  author: string;
  quote: string;
  rating: number;
  details: string | null;
  sort: number | null;
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
  faq_items: DirectusFaqItem[];
  reviews: DirectusReview[];
  property_types: DirectusPropertyType[];
  callback_requests: DirectusCallbackRequest[];
}
