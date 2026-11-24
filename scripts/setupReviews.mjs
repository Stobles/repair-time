import { setupContentCollection, translations } from "./directusContent.mjs";
import localReviews from "../src/features/reviews/model/localReviews.json" with { type: "json" };

const ratings = [1, 2, 3, 4, 5];
const fields = [
  {
    field: "id", type: "uuid",
    schema: { is_primary_key: true, is_nullable: false },
    meta: { special: ["uuid"], hidden: true, readonly: true },
  },
  {
    field: "author", type: "string",
    schema: { is_nullable: false },
    meta: {
      interface: "input", required: true, translations: translations("Автор"),
      validation: { _and: [{ author: { _regex: "\\S" } }] },
      validation_message: "Укажите имя автора.",
    },
  },
  {
    field: "quote", type: "text",
    schema: { is_nullable: false },
    meta: {
      interface: "input-multiline", required: true, translations: translations("Отзыв"),
      validation: { _and: [{ quote: { _regex: "\\S" } }] },
      validation_message: "Введите текст отзыва.",
    },
  },
  {
    field: "rating", type: "integer",
    schema: { is_nullable: false },
    meta: {
      interface: "select-dropdown", required: true, translations: translations("Оценка"),
      options: { choices: ratings.map((value) => ({ text: String(value), value })) },
      validation: { _and: [{ rating: { _in: ratings } }] },
      validation_message: "Выберите целую оценку от 1 до 5.",
    },
  },
  {
    field: "details", type: "string",
    schema: { is_nullable: true },
    meta: { interface: "input", translations: translations("Подпись к автору") },
  },
  {
    field: "sort", type: "integer",
    schema: { is_nullable: true },
    meta: { interface: "input", hidden: true },
  },
];

const args = process.argv.slice(2);
const [envFile] = args.filter((arg) => arg !== "--seed");
const seedEntries = args.includes("--seed") ? localReviews.map((entry, index) => ({
  ...entry,
  id: `bf9ced43-1ae7-410a-a5fb-${String(index + 1).padStart(12, "0")}`,
  sort: index + 1,
})) : undefined;

await setupContentCollection({
  envFile,
  collection: "reviews",
  name: "reviews",
  fields,
  meta: {
    translations: translations("Отзывы"),
    icon: "rate_review",
    display_template: "{{author}}",
    sort_field: "sort",
  },
  listFields: ["author", "rating"],
  seedEntries,
});
