import type { ImageMetadata } from "astro";
import apartmentsDesktop from "@/shared/assets/projects/apartments-desktop.webp";
import livingRoom from "@/shared/assets/projects/living-room.webp";
import office from "@/shared/assets/projects/office.webp";
import apartmentsMobile from "../assets/apartments-mobile.webp";
import cityApartment from "../assets/city-apartment.webp";

export interface HeroSlide {
  title: string;
  image: ImageMetadata;
  mobileImage?: ImageMetadata;
  alt: string;
}

export const heroSlides: readonly HeroSlide[] = [
  {
    title: "Скидка 15% на капитальный ремонт офисов и квартир",
    image: office,
    mobileImage: livingRoom,
    alt: "Гостиная с панорамным видом на город",
  },
  {
    title: "Скидка 15% на капитальный ремонт офисов",
    image: office,
    alt: "Светлый офис с остеклёнными перегородками",
  },
  {
    title: "Скидка 15% на капитальный ремонт апартаментов",
    image: livingRoom,
    alt: "Гостиная с большим диваном и панорамными окнами",
  },
  {
    title: "Скидка 15% на капитальный ремонт квартир",
    image: office,
    alt: "Кухня-гостиная с видом на небоскрёбы",
  },
];
