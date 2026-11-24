import { randomBytes } from "node:crypto";
import { appendFile, readFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import {
  authentication, createCollection, createDirectus, createField, createItem,
  createPreset, createRelation, createUser, deleteField, readCollections,
  readFieldsByCollection, readItems, readMe, readPresets, readRelationByCollection, readUsers, rest, staticToken,
} from "@directus/sdk";
import { ensurePolicy, grantUserPolicy } from "./directusAccess.mjs";

const group = "requests";
const propertyTypes = "property_types";
const callbackRequests = "callback_requests";
const callbackFields = ["name", "phone", "property", "message"];
const seeds = [
  { id: "apartment", name: "Квартира или апартаменты", sort: 10 },
  { id: "house", name: "Загородный дом", sort: 20 },
  { id: "commercial", name: "Коммерческое помещение", sort: 30 },
  { id: "other", name: "Другое", sort: 40 },
];

function translations(translation) {
  return [
    { language: "ru-RU", translation },
    { language: "en-US", translation },
  ];
}

function field(field, type, label, schema = {}, meta = {}) {
  return {
    field, type,
    schema: { is_nullable: false, ...schema },
    meta: { required: true, translations: translations(label), ...meta },
  };
}

const propertyTypeFields = [
  field("id", "string", "Код", { is_primary_key: true, max_length: 64 }),
  field("name", "string", "Название", { max_length: 120 }),
  field("sort", "integer", "Порядок", { default_value: 0 }),
  field("is_active", "boolean", "Доступен в форме", { default_value: true }, { interface: "boolean" }),
];
const requestFields = [
  field("id", "uuid", "ID", { is_primary_key: true }, { special: ["uuid"], hidden: true, readonly: true, required: false }),
  field("date_created", "timestamp", "Дата создания", {}, { special: ["date-created"], readonly: true, required: false, interface: "datetime" }),
  field("name", "string", "Имя", { max_length: 120 }),
  field("phone", "string", "Телефон", { max_length: 64 }),
  field("property", "string", "Тип объекта", { max_length: 64 }, {
    special: ["m2o"], interface: "select-dropdown-m2o", options: { template: "{{name}}" },
  }),
  field("message", "text", "Сообщение", {}, { interface: "input-multiline" }),
];

async function setupSchema(admin, removeConsent) {
  const collections = await admin.request(readCollections());
  const folder = collections.find(({ collection }) => collection === group);
  if (folder?.schema) throw new Error("requests already exists as a data collection.");
  if (!folder) {
    await admin.request(createCollection({
      collection: group, schema: null,
      meta: { translations: translations("Заявки"), icon: "folder", collapse: "open" },
    }));
  }

  async function ensureCollection(collection, label, fields, meta) {
    const existing = collections.find((entry) => entry.collection === collection);
    if (!existing) {
      await admin.request(createCollection({
        collection, schema: {}, fields,
        meta: { group, translations: translations(label), ...meta },
      }));
      return;
    }
    if (!existing.schema || existing.meta?.group !== group) {
      throw new Error(`${collection} exists outside the expected data group.`);
    }

    const currentFields = await admin.request(readFieldsByCollection(collection));
    for (const expected of fields) {
      const current = currentFields.find((entry) => entry.field === expected.field);
      if (!current && !expected.schema.is_primary_key) {
        await admin.request(createField(collection, expected));
      } else if (
        !current || current.type !== expected.type ||
        current.schema?.is_nullable !== false ||
        Boolean(current.schema?.is_primary_key) !== Boolean(expected.schema.is_primary_key)
      ) {
        throw new Error(`Incompatible field ${collection}.${expected.field}.`);
      }
    }
  }

  await ensureCollection(propertyTypes, "Типы объектов", propertyTypeFields, {
    icon: "category", display_template: "{{name}}", sort_field: "sort",
  });
  await ensureCollection(callbackRequests, "Заявки с сайта", requestFields, {
    icon: "inbox", display_template: "{{name}} · {{property.name}}",
  });

  if (removeConsent) {
    const fields = await admin.request(readFieldsByCollection(callbackRequests));
    if (fields.some(({ field }) => field === "consent")) {
      await admin.request(deleteField(callbackRequests, "consent"));
    }
  }

  const relations = await admin.request(readRelationByCollection(callbackRequests));
  const propertyRelation = relations.find(({ field }) => field === "property");
  if (!propertyRelation) {
    await admin.request(createRelation({
      collection: callbackRequests, field: "property", related_collection: propertyTypes,
      schema: { on_delete: "RESTRICT" },
    }));
  } else if (propertyRelation.related_collection !== propertyTypes || propertyRelation.schema?.on_delete !== "RESTRICT") {
    throw new Error("Incompatible relation callback_requests.property.");
  }

  const existing = await admin.request(readItems(propertyTypes, { fields: ["id"], limit: -1 }));
  for (const seed of seeds) {
    if (!existing.some(({ id }) => id === seed.id)) {
      await admin.request(createItem(propertyTypes, { ...seed, is_active: true }));
    }
  }

  const presets = await admin.request(readPresets({ filter: {
    collection: { _eq: callbackRequests }, bookmark: { _null: true },
    user: { _null: true }, role: { _null: true },
  } }));
  if (presets.length === 0) {
    await admin.request(createPreset({
      collection: callbackRequests,
      layout: "tabular",
      layout_query: {
        tabular: { fields: ["date_created", "name", "phone", "property"], sort: ["-date_created"] },
      },
    }));
  }
}

async function setupAccess(admin, url, config) {
  const reader = createDirectus(url).with(staticToken(config.DIRECTUS_TOKEN.trim())).with(rest());
  const { id: readerId } = await reader.request(readMe({ fields: ["id"] }));
  const readPolicy = await ensurePolicy(admin, "Website property types reader", {
    collection: propertyTypes, action: "read", fields: ["id", "name", "sort", "is_active"],
    permissions: { is_active: { _eq: true } },
  });
  await grantUserPolicy(admin, readerId, readPolicy);

  const writePolicy = await ensurePolicy(admin, "Website callback request writer", {
    collection: callbackRequests, action: "create", fields: callbackFields,
  });
  const email = "repair-time-callback-writer@example.com";
  const [writer] = await admin.request(readUsers({
    fields: ["id", "status", "role", "policies.policy"],
    filter: { email: { _eq: email } },
  }));
  if (writer && (writer.status !== "active" || writer.role || writer.policies.length !== 1 || writer.policies[0].policy !== writePolicy)) {
    throw new Error("Existing callback service account has unexpected access.");
  }
  const configuredToken = config.DIRECTUS_CALLBACK_TOKEN?.trim();
  if (configuredToken) {
    const client = createDirectus(url).with(staticToken(configuredToken)).with(rest());
    const identity = await client.request(readMe({ fields: ["id"] })).catch(() => null);
    if (!writer || identity?.id !== writer.id) {
      throw new Error("Configured callback token does not match the provisioned service account.");
    }
    return configuredToken;
  }
  if (writer) {
    throw new Error("Set the existing callback service account token in the chosen env file.");
  }

  const token = randomBytes(32).toString("hex");
  await admin.request(createUser({ email, status: "active", token, policies: [{ policy: writePolicy }] }));
  return token;
}

async function main() {
  const args = process.argv.slice(2);
  const schemaOnly = args.includes("--schema-only");
  const removeConsent = args.includes("--remove-consent");
  const [envFile = ".env"] = args.filter((arg) => !["--schema-only", "--remove-consent"].includes(arg));
  const config = parseEnv(await readFile(envFile, "utf8"));
  const url = new URL(config.DIRECTUS_URL?.trim() || "http://localhost:8055");
  if (!config.ADMIN_EMAIL || !config.ADMIN_PASSWORD || (!schemaOnly && !config.DIRECTUS_TOKEN?.trim())) {
    throw new Error("Set ADMIN_EMAIL, ADMIN_PASSWORD and, for access setup, DIRECTUS_TOKEN in the chosen env file.");
  }
  const admin = createDirectus(url).with(authentication("json")).with(rest());
  await admin.login({ email: config.ADMIN_EMAIL, password: config.ADMIN_PASSWORD });
  try {
    await setupSchema(admin, removeConsent);
    if (!schemaOnly) {
      const token = await setupAccess(admin, url, config);
      if (!config.DIRECTUS_CALLBACK_TOKEN?.trim()) {
        await appendFile(envFile, `\nDIRECTUS_CALLBACK_TOKEN=${token}\n`, "utf8");
      }
    }
  } finally {
    await admin.logout();
  }
  console.log("Directus callback setup complete.");
}

main().catch((error) => {
  const message = error instanceof Error
    ? error.message
    : error?.errors?.map(({ extensions }) => extensions?.code ?? "UNKNOWN").join(", ") ?? "Unknown Directus error.";
  console.error(`Directus callback setup failed. ${message}`);
  process.exitCode = 1;
});
