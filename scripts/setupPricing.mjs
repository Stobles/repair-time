import { setupContentCollection, translations } from "./directusContent.mjs";
import localPricingItems from "../src/features/pricing/model/localPricingItems.json" with { type: "json" };

const units = [
  { text: "За м²", value: "square_meter" },
  { text: "За штуку", value: "item" },
  { text: "За работу", value: "job" },
];

const fields = [
  {
    field: "id", type: "uuid",
    schema: { is_primary_key: true, is_nullable: false },
    meta: { special: ["uuid"], hidden: true, readonly: true },
  },
  {
    field: "title", type: "string",
    schema: { is_nullable: false },
    meta: {
      interface: "input", required: true, translations: translations("Название"),
      validation: { _and: [{ title: { _regex: "\\S" } }] },
      validation_message: "Укажите название услуги.",
    },
  },
  {
    field: "description", type: "text",
    schema: { is_nullable: false },
    meta: {
      interface: "input-multiline", required: true, translations: translations("Описание"),
      validation: { _and: [{ description: { _regex: "\\S" } }] },
      validation_message: "Добавьте описание услуги.",
    },
  },
  {
    field: "price_from", type: "integer",
    schema: { is_nullable: false },
    meta: {
      interface: "input", required: true, width: "half", translations: translations("Цена от, ₽"),
      validation: { _and: [{ price_from: { _gte: 1 } }] },
      validation_message: "Укажите цену в целых рублях больше нуля.",
    },
  },
  {
    field: "price_unit", type: "string",
    schema: { is_nullable: false },
    meta: {
      interface: "select-dropdown", required: true, width: "half", translations: translations("Единица расчёта"),
      options: { choices: units },
      validation: { _and: [{ price_unit: { _in: units.map(({ value }) => value) } }] },
      validation_message: "Выберите единицу расчёта.",
    },
  },
  {
    field: "features", type: "json",
    schema: { is_nullable: false },
    meta: {
      interface: "list", required: true, translations: translations("Список работ"),
      options: {
        template: "{{label}}",
        addLabel: "Добавить работу",
        fields: [
          {
            field: "label", name: "Название работы", type: "string",
            meta: { interface: "input", required: true },
          },
          {
            field: "unavailable", name: "Не входит в стоимость", type: "boolean",
            schema: { default_value: false },
            meta: { interface: "boolean" },
          },
        ],
      },
    },
  },
  {
    field: "is_featured", type: "boolean",
    schema: { default_value: false, is_nullable: false },
    meta: { interface: "boolean", translations: translations("Выделить карточку") },
  },
  {
    field: "sort", type: "integer",
    schema: { is_nullable: true },
    meta: { interface: "input", hidden: true },
  },
];

const args = process.argv.slice(2);
const [envFile] = args.filter((arg) => arg !== "--seed");
const seedEntries = args.includes("--seed") ? localPricingItems.map((entry, index) => ({
  ...entry,
  id: `c8b0f531-c2e7-4cf0-9cda-${String(index + 1).padStart(12, "0")}`,
  sort: index + 1,
})) : undefined;

await setupContentCollection({
  envFile,
  collection: "pricing_items",
  name: "pricing",
  fields,
  meta: {
    translations: translations("Стоимость работ"),
    icon: "request_quote",
    display_template: "{{title}}",
    sort_field: "sort",
  },
  listFields: ["title", "price_from", "price_unit"],
  seedEntries,
});
