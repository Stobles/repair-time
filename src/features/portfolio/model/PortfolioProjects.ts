import type { ImageMetadata } from "astro";
import apartmentImage from "@/shared/assets/projects/apartments-desktop.webp";
import livingRoomImage from "@/shared/assets/projects/living-room.webp";
import officeImage from "@/shared/assets/projects/office.webp";

export interface ProjectPhoto {
  image: ImageMetadata;
  alt: string;
}

export interface PortfolioProject {
  id: string;
  previewTitle: string;
  title: string;
  description: string;
  propertyType: string;
  area: string;
  renovationType: string;
  duration: string;
  year: string;
  budget: string;
  photos: readonly [ProjectPhoto, ...ProjectPhoto[]];
}

const apartment = {
  image: apartmentImage,
  alt: "Гостиная с панорамным видом на город",
};
const livingRoom = {
  image: livingRoomImage,
  alt: "Светлая гостиная с панорамными окнами",
};
const office = {
  image: officeImage,
  alt: "Офис с остеклёнными перегородками",
};

// Demo content. The same photos can appear in multiple galleries until project material is available.
export const portfolioProjects: readonly PortfolioProject[] = [
  {
    id: "modern-apartment",
    previewTitle: "Квартира в современном стиле",
    title: "Ремонт современной квартиры",
    description:
      "Выполнили комплексный ремонт квартиры с продуманной планировкой, современной отделкой и вниманием к деталям. Подобрали материалы и реализовали интерьер с учётом пожеланий заказчика.",
    propertyType: "Квартира",
    area: "85 м²",
    renovationType: "Под ключ",
    duration: "3 месяца",
    year: "2026",
    budget: "3 890 000 ₽",
    photos: [livingRoom, office, livingRoom, office, livingRoom],
  },
  {
    id: "office",
    previewTitle: "Ремонт офиса",
    title: "Комплексный ремонт офиса",
    description:
      "Обновили рабочие зоны, переговорные и зону приёма гостей. Предусмотрели отдельное освещение и розетки возле каждого рабочего места.",
    propertyType: "Офис",
    area: "240 м²",
    renovationType: "Под ключ",
    duration: "4 месяца",
    year: "2026",
    budget: "7 200 000 ₽",
    photos: [office, livingRoom, office],
  },
  {
    id: "apartments",
    previewTitle: "Ремонт апартаментов",
    title: "Ремонт светлых апартаментов",
    description:
      "Объединили кухню и гостиную, предусмотрели встроенные системы хранения. Для отделки выбрали светлые материалы и натуральное дерево.",
    propertyType: "Апартаменты",
    area: "240 м²",
    renovationType: "Под ключ",
    duration: "5 месяцев",
    year: "2026",
    budget: "8 400 000 ₽",
    photos: [livingRoom, office, livingRoom],
  },
  {
    id: "commercial",
    previewTitle: "Коммерческое помещение",
    title: "Ремонт коммерческого помещения",
    description:
      "Подготовили помещение к открытию. Обновили электрику и освещение, уложили износостойкое покрытие и отделали зону для посетителей.",
    propertyType: "Коммерческое помещение",
    area: "180 м²",
    renovationType: "Под ключ",
    duration: "3 месяца",
    year: "2026",
    budget: "5 600 000 ₽",
    photos: [office, livingRoom, office],
  },
];
