const sectionLabels = {
  hero: "Первый экран",
  portfolio: "Портфолио",
  about: "О компании",
  why_choose_us: "Почему нас выбирают",
  work_process: "Этапы работ",
  pricing: "Стоимость работ",
  reviews: "Отзывы",
  faq: "Частые вопросы",
  contacts: "Контакты",
};

export default sectionLabels;

export type SectionKey = keyof typeof sectionLabels;
export type ToggleableSectionKey = Exclude<SectionKey, "contacts">;

export const toggleableSectionKeys = (Object.keys(sectionLabels) as SectionKey[])
  .filter((key) => key !== "contacts");
