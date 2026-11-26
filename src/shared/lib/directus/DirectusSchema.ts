import type { ToggleableSectionKey } from "./sectionLabels";

interface DirectusFile {
  id: string;
  description: string | null;
  type: string | null;
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

interface DirectusPricingItem {
  id: string;
  sort: number | null;
  title: string;
  description: string;
  price_from: number;
  price_unit: string;
  is_featured: boolean;
  features: unknown;
}

interface DirectusPortfolioProjectFile {
  id: string;
  project_id: string | DirectusPortfolioProject;
  file_id: string | DirectusFile;
  sort: number | null;
}

interface DirectusPortfolioProject {
  id: string;
  title: string;
  description: string;
  preview_title: string | null;
  preview_text: string | null;
  badge: string | null;
  specifications: unknown;
  photos: string[] | DirectusPortfolioProjectFile[];
  status: "draft" | "published" | "archived";
  sort: number | null;
}

export interface DirectusSchema {
  section_visibility: Record<ToggleableSectionKey, boolean> & { id: string };
  directus_files: DirectusFile[];
  hero_slides: DirectusHeroSlide[];
  faq_items: DirectusFaqItem[];
  reviews: DirectusReview[];
  pricing_items: DirectusPricingItem[];
  portfolio_projects: DirectusPortfolioProject[];
  portfolio_project_files: DirectusPortfolioProjectFile[];
  property_types: DirectusPropertyType[];
  callback_requests: DirectusCallbackRequest[];
}
