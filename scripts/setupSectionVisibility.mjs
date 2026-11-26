import { readFieldsByCollection, readSingleton, updateField, updateSingleton } from "@directus/sdk";
import { ensureCollection, translations, withContentAdmin } from "./directusContent.mjs";
import { ensurePolicy, grantUserPolicy } from "./directusAccess.mjs";
import sectionLabels, { toggleableSectionKeys } from "../src/shared/lib/directus/sectionLabels.ts";

const collection = "section_visibility";
const fields = [
  {
    field: "id", type: "uuid",
    schema: { is_primary_key: true, is_nullable: false },
    meta: { special: ["uuid"], hidden: true, readonly: true },
  },
  ...toggleableSectionKeys.map((field) => ({
    field, type: "boolean",
    schema: { is_nullable: false, default_value: true },
    meta: {
      interface: "boolean",
      special: ["cast-boolean"],
      translations: translations(sectionLabels[field]),
      options: { label: "Показывать" },
    },
  })),
];

await withContentAdmin({ envFile: process.argv[2], name: "section visibility" }, async (admin, readerId) => {
  await ensureCollection(admin, collection, fields, {
    singleton: true,
    icon: "visibility",
    translations: translations("Видимость секций"),
  });
  const currentFields = await admin.request(readFieldsByCollection(collection));
  const legacyContacts = currentFields.find(({ field }) => field === "contacts");
  if (legacyContacts && !legacyContacts.meta?.hidden) {
    await admin.request(updateField(collection, "contacts", { meta: { hidden: true } }));
  }
  const settings = await admin.request(readSingleton(collection, { fields: ["id"] }));
  if (!settings?.id) {
    await admin.request(updateSingleton(collection, Object.fromEntries(
      toggleableSectionKeys.map((field) => [field, true]),
    )));
  }
  const policy = await ensurePolicy(admin, "Website section visibility reader", {
    collection, action: "read", fields: fields.map(({ field }) => field),
  }, ["contacts"]);
  await grantUserPolicy(admin, readerId, policy);
});
