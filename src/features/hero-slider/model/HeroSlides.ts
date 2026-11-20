import type { ImageMetadata } from "astro";
import apartmentsDesktop from "../assets/apartments-desktop.webp";
import apartmentsMobile from "../assets/apartments-mobile.webp";
import cityApartment from "../assets/city-apartment.webp";
import livingRoom from "../assets/living-room.webp";
import office from "../assets/office.webp";

export interface HeroSlide {
  title: string;
  image: ImageMetadata;
  mobileImage?: ImageMetadata;
  alt: string;
}

export const heroSlides: readonly HeroSlide[] = [
  {
    title: "Скидка 15% на капитальный ремонт офисов и квартир",
    image: apartmentsDesktop,
    mobileImage: apartmentsMobile,
    alt: "Гостиная с панорамным видом на Кремль",
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
    image: cityApartment,
    alt: "Кухня-гостиная с видом на Москва-Сити",
  },
];
