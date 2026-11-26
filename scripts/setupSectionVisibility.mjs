import { readSingleton, updateSingleton } from "@directus/sdk";
import { ensureCollection, translations, withContentAdmin } from "./directusContent.mjs";
import { ensurePolicy, grantUserPolicy } from "./directusAccess.mjs";
import sectionLabels from "../src/shared/lib/directus/sectionLabels.json" with { type: "json" };

const collection = "section_visibility";
const fields = [
  {
    field: "id", type: "uuid",
    schema: { is_primary_key: true, is_nullable: false },
    meta: { special: ["uuid"], hidden: true, readonly: true },
  },
  ...Object.entries(sectionLabels).map(([field, label]) => ({
    field, type: "boolean",
    schema: { is_nullable: false, default_value: true },
    meta: {
      interface: "boolean",
      special: ["cast-boolean"],
      translations: translations(label),
      options: { label: "Показывать" },
      ...(field === "contacts" && { note: "Скрывает контактные данные в секции и ссылку в меню. Форма заявки остаётся на странице." }),
    },
  })),
];

await withContentAdmin({ envFile: process.argv[2], name: "section visibility" }, async (admin, readerId) => {
  await ensureCollection(admin, collection, fields, {
    singleton: true,
    icon: "visibility",
    translations: translations("Видимость секций"),
  });
  const settings = await admin.request(readSingleton(collection, { fields: ["id"] }));
  if (!settings?.id) {
    await admin.request(updateSingleton(collection, Object.fromEntries(
      Object.keys(sectionLabels).map((field) => [field, true]),
    )));
  }
  const policy = await ensurePolicy(admin, "Website section visibility reader", {
    collection, action: "read", fields: fields.map(({ field }) => field),
  });
  await grantUserPolicy(admin, readerId, policy);
});
