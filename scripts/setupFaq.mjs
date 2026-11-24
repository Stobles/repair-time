import { setupContentCollection, translations } from "./directusContent.mjs";
import localFaqEntries from "../src/features/faq/model/localFaqEntries.json" with { type: "json" };

const fields = [
  {
    field: "id", type: "uuid",
    schema: { is_primary_key: true, is_nullable: false },
    meta: { special: ["uuid"], hidden: true, readonly: true },
  },
  {
    field: "question", type: "string",
    schema: { is_nullable: false },
    meta: { interface: "input", required: true, translations: translations("Вопрос") },
  },
  {
    field: "answer", type: "text",
    schema: { is_nullable: false },
    meta: { interface: "input-multiline", required: true, translations: translations("Ответ") },
  },
  {
    field: "sort", type: "integer",
    schema: { is_nullable: true },
    meta: { interface: "input", hidden: true },
  },
];

await setupContentCollection({
  envFile: process.argv[2],
  collection: "faq_items",
  name: "FAQ",
  fields,
  meta: {
    translations: translations("Частые вопросы"),
    icon: "help_outline",
    display_template: "{{question}}",
    sort_field: "sort",
  },
  listFields: ["question"],
  // Fixed seed IDs keep overlapping setup runs from inserting duplicate rows.
  seedEntries: localFaqEntries.map((entry, index) => ({
    ...entry,
    id: `67e7e975-9a7e-45af-8d96-${String(index + 1).padStart(12, "0")}`,
    sort: index + 1,
  })),
});
