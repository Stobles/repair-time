import livingRoomImage from "@/shared/assets/projects/living-room.webp";
import officeImage from "@/shared/assets/projects/office.webp";

export interface ProjectPhoto {
  image: { src: string; width?: number; height?: number };
  alt: string;
}

interface ProjectSpecification {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface PortfolioProject {
  id: string;
  previewTitle: string;
  previewText?: string;
  title: string;
  description: string;
  badge?: string;
  specifications: readonly ProjectSpecification[];
  photos: readonly [ProjectPhoto, ...ProjectPhoto[]];
}

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
    previewText: "Площадь: 85 м²",
    title: "Ремонт современной квартиры",
    description:
      "Выполнили комплексный ремонт квартиры с продуманной планировкой, современной отделкой и вниманием к деталям. Подобрали материалы и реализовали интерьер с учётом пожеланий заказчика.",
    badge: "Кейс под ключ",
    specifications: [
      { label: "Тип объекта", value: "Квартира" },
      { label: "Площадь", value: "85 м²" },
      { label: "Тип ремонта", value: "Под ключ" },
      { label: "Срок выполнения", value: "3 месяца" },
      { label: "Год завершения", value: "2026" },
      { label: "Бюджет объекта", value: "3 890 000 ₽", highlight: true },
    ],
    photos: [livingRoom, office, livingRoom, office, livingRoom],
  },
  {
    id: "office",
    previewTitle: "Ремонт офиса",
    previewText: "Площадь: 240 м²",
    title: "Комплексный ремонт офиса",
    description:
      "Обновили рабочие зоны, переговорные и зону приёма гостей. Предусмотрели отдельное освещение и розетки возле каждого рабочего места.",
    badge: "Кейс под ключ",
    specifications: [
      { label: "Тип объекта", value: "Офис" },
      { label: "Площадь", value: "240 м²" },
      { label: "Тип ремонта", value: "Под ключ" },
      { label: "Срок выполнения", value: "4 месяца" },
      { label: "Год завершения", value: "2026" },
      { label: "Бюджет объекта", value: "7 200 000 ₽", highlight: true },
    ],
    photos: [office, livingRoom, office],
  },
  {
    id: "apartments",
    previewTitle: "Ремонт апартаментов",
    previewText: "Площадь: 240 м²",
    title: "Ремонт светлых апартаментов",
    description:
      "Объединили кухню и гостиную, предусмотрели встроенные системы хранения. Для отделки выбрали светлые материалы и натуральное дерево.",
    badge: "Кейс под ключ",
    specifications: [
      { label: "Тип объекта", value: "Апартаменты" },
      { label: "Площадь", value: "240 м²" },
      { label: "Тип ремонта", value: "Под ключ" },
      { label: "Срок выполнения", value: "5 месяцев" },
      { label: "Год завершения", value: "2026" },
      { label: "Бюджет объекта", value: "8 400 000 ₽", highlight: true },
    ],
    photos: [livingRoom, office, livingRoom],
  },
  {
    id: "commercial",
    previewTitle: "Коммерческое помещение",
    previewText: "Площадь: 180 м²",
    title: "Ремонт коммерческого помещения",
    description:
      "Подготовили помещение к открытию. Обновили электрику и освещение, уложили износостойкое покрытие и отделали зону для посетителей.",
    badge: "Кейс под ключ",
    specifications: [
      { label: "Тип объекта", value: "Коммерческое помещение" },
      { label: "Площадь", value: "180 м²" },
      { label: "Тип ремонта", value: "Под ключ" },
      { label: "Срок выполнения", value: "3 месяца" },
      { label: "Год завершения", value: "2026" },
      { label: "Бюджет объекта", value: "5 600 000 ₽", highlight: true },
    ],
    photos: [office, livingRoom, office],
  },
];
