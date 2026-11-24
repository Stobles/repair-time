import { readFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import {
  authentication, createCollection, createDirectus, createItems, createPreset, readCollections,
  readFieldsByCollection, readItems, readMe, readPresets, rest, staticToken,
} from "@directus/sdk";
import { ensurePolicy, grantUserPolicy } from "./directusAccess.mjs";
import localFaqEntries from "../src/features/faq/model/localFaqEntries.json" with { type: "json" };

const collection = "faq_items";

function translations(translation) {
  return ["ru-RU", "en-US"].map((language) => ({ language, translation }));
}

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

async function ensureCollection(admin) {
  const collections = await admin.request(readCollections());
  const existing = collections.find((entry) => entry.collection === collection);
  if (!existing) {
    await admin.request(createCollection({
      collection, schema: {}, fields,
      meta: {
        translations: translations("Частые вопросы"),
        icon: "help_outline",
        display_template: "{{question}}",
        sort_field: "sort",
      },
    }));
    return;
  }

  if (!existing.schema || existing.meta?.singleton || existing.meta?.sort_field !== "sort") {
    throw new Error(`Incompatible collection ${collection}.`);
  }

  const currentFields = await admin.request(readFieldsByCollection(collection));
  for (const expected of fields) {
    const current = currentFields.find(({ field }) => field === expected.field);
    if (
      current?.type !== expected.type || current.schema?.is_nullable !== expected.schema.is_nullable ||
      Boolean(current.schema?.is_primary_key) !== Boolean(expected.schema.is_primary_key) ||
      (expected.meta.required && !current.meta?.required)
    ) throw new Error(`Incompatible field ${collection}.${expected.field}.`);
  }
}

async function ensureDefaultLayout(admin) {
  const presets = await admin.request(readPresets({ filter: {
    collection: { _eq: collection }, bookmark: { _null: true },
    user: { _null: true }, role: { _null: true },
  } }));
  if (presets.length === 0) {
    await admin.request(createPreset({
      collection,
      layout: "tabular",
      layout_query: { tabular: { fields: ["question"], sort: ["sort"] } },
    }));
  }
}

async function seedEmptyCollection(admin) {
  const existing = await admin.request(readItems(collection, { fields: ["id"], limit: 1 }));
  if (existing.length > 0) return;

  // Fixed seed IDs keep overlapping setup runs from inserting duplicate rows.
  const entries = localFaqEntries.map((entry, index) => ({
    ...entry,
    id: `67e7e975-9a7e-45af-8d96-${String(index + 1).padStart(12, "0")}`,
    sort: index + 1,
  }));
  await admin.request(createItems(collection, entries));
}

async function main() {
  const [envFile = ".env"] = process.argv.slice(2);
  const config = parseEnv(await readFile(envFile, "utf8"));
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = config;
  const token = config.DIRECTUS_TOKEN?.trim();
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !token) {
    throw new Error("Set ADMIN_EMAIL, ADMIN_PASSWORD and DIRECTUS_TOKEN in the chosen env file.");
  }

  const url = new URL(config.DIRECTUS_URL?.trim() || "http://localhost:8055");
  const reader = createDirectus(url).with(staticToken(token)).with(rest());
  const { id: readerId } = await reader.request(readMe({ fields: ["id"] }));
  const admin = createDirectus(url).with(authentication("json")).with(rest());
  await admin.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  try {
    await ensureCollection(admin);
    await seedEmptyCollection(admin);
    await ensureDefaultLayout(admin);
    const policy = await ensurePolicy(admin, "Website FAQ reader", {
      collection, action: "read", fields: fields.map(({ field }) => field),
    });
    await grantUserPolicy(admin, readerId, policy);
  } finally {
    await admin.logout();
  }
  console.log("Directus FAQ setup complete.");
}

main().catch((error) => {
  const message = error instanceof Error
    ? error.message
    : error?.errors?.map(({ extensions }) => extensions?.code ?? "UNKNOWN").join(", ") ?? "Unknown Directus error.";
  console.error(`Directus FAQ setup failed. ${message}`);
  process.exitCode = 1;
});
