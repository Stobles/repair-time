import { isDeepStrictEqual } from "node:util";
import { readFieldsByCollection, readSingleton, updateField, updateSingleton } from "@directus/sdk";
import { ensurePolicy, grantUserPolicy } from "./directusAccess.mjs";
import { ensureCollection, translations, withContentAdmin } from "./directusContent.mjs";
import localContacts from "../src/features/company-details/model/localContacts.json" with { type: "json" };

const collection = "company_details";
const contacts = {
  phone: "Основной телефон",
  email: "Электронная почта",
  telegram_phone: "Номер для Telegram",
  whatsapp_phone: "Номер для WhatsApp",
};
const requisites = {
  proprietor_name: "ФИО предпринимателя",
  inn: "ИНН",
  ogrnip: "ОГРНИП",
};
const identifierLengths = { inn: 12, ogrnip: 15 };

function textField(field, label, required, sort) {
  return {
    field, type: "string",
    schema: { is_nullable: !required },
    meta: { interface: "input", required, sort, translations: translations(label) },
  };
}

const fields = [
  {
    field: "id", type: "uuid",
    schema: { is_primary_key: true, is_nullable: false },
    meta: { special: ["uuid"], hidden: true, readonly: true },
  },
  ...Object.entries(contacts).map(([field, label], index) => textField(field, label, true, index + 1)),
  ...Object.entries(requisites).map(([field, label], index) =>
    textField(field, label, false, Object.keys(contacts).length + index + 1)),
];

await withContentAdmin({ envFile: process.argv[2], name: "company details" }, async (admin, readerId) => {
  await ensureCollection(admin, collection, fields, {
    singleton: true,
    icon: "contact_phone",
    translations: translations("Данные компании"),
  });

  const currentFields = await admin.request(readFieldsByCollection(collection));
  for (const [field, length] of Object.entries(identifierLengths)) {
    const current = currentFields.find((entry) => entry.field === field);
    const pattern = `^[0-9]{${length}}$`;
    const validation = { _and: [{ _or: [
      { [field]: { _null: true } },
      { [field]: { _empty: true } },
      { [field]: { _regex: pattern } },
    ] }] };
    const validationMessage = `${requisites[field]} должен содержать ровно ${length} цифр.`;
    if (!isDeepStrictEqual(current?.meta?.validation, validation) || current?.meta?.validation_message !== validationMessage) {
      await admin.request(updateField(collection, field, { meta: { validation, validation_message: validationMessage } }));
    }
  }

  const details = await admin.request(readSingleton(collection, { fields: ["id"] }));
  if (!details?.id) await admin.request(updateSingleton(collection, localContacts));

  const readPermission = {
    collection, action: "read", fields: fields.map(({ field }) => field),
  };
  const policy = await ensurePolicy(admin, "Website company details reader", readPermission);
  await grantUserPolicy(admin, readerId, policy);
  await ensurePolicy(admin, "Company details editor", [
    readPermission,
    { collection, action: "update", fields: [...Object.keys(contacts), ...Object.keys(requisites)] },
  ]);
});
