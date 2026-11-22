import livingRoom from "@/shared/assets/projects/living-room.webp";
import office from "@/shared/assets/projects/office.webp";
import type { HeroSlide } from "../types/heroSlide";

const badge = "СЕЗОННАЯ АКЦИЯ ДО 31 ДЕКАБРЯ";
const description =
  "Фиксируем смету в договоре без доплат. Оплата поэтапно по факту приёмки. Подарок: страховка объекта на 50\u00a0000\u00a0000\u00a0₽ и рабочий дизайн-проект.";

export const heroSlides: readonly HeroSlide[] = [
  {
    badge,
    title: "Скидка 15% на капитальный ремонт офисов и квартир",
    description,
    image: office,
    mobileImageSrc: livingRoom.src,
    alt: "Пример капитального ремонта с панорамными окнами",
  },
  {
    badge,
    title: "Скидка 15% на капитальный ремонт офисов",
    description,
    image: office,
    alt: "Светлый офис с остеклёнными перегородками",
  },
  {
    badge,
    title: "Скидка 15% на капитальный ремонт апартаментов",
    description,
    image: livingRoom,
    alt: "Гостиная с большим диваном и панорамными окнами",
  },
  {
    badge,
    title: "Скидка 15% на капитальный ремонт квартир",
    description,
    image: office,
    alt: "Светлый офис с остеклёнными перегородками",
  },
];
