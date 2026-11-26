import { readFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import {
  authentication, createCollection, createDirectus, createItems, createPreset, readCollections,
  readFieldsByCollection, readItems, readMe, readPresets, rest, staticToken,
} from "@directus/sdk";
import { ensurePolicy, grantUserPolicy } from "./directusAccess.mjs";

export function translations(translation) {
  return ["ru-RU", "en-US"].map((language) => ({ language, translation }));
}

export async function ensureCollection(admin, collection, fields, meta) {
  const collections = await admin.request(readCollections());
  const existing = collections.find((entry) => entry.collection === collection);
  if (!existing) {
    await admin.request(createCollection({ collection, schema: {}, fields, meta }));
    return;
  }

  if (!existing.schema || Boolean(existing.meta?.singleton) !== Boolean(meta.singleton) ||
    (existing.meta?.sort_field ?? null) !== (meta.sort_field ?? null)) {
    throw new Error(`Incompatible collection ${collection}.`);
  }

  const currentFields = await admin.request(readFieldsByCollection(collection));
  for (const expected of fields) {
    const current = currentFields.find(({ field }) => field === expected.field);
    if (
      current?.type !== expected.type || current.schema?.is_nullable !== expected.schema.is_nullable ||
      Boolean(current.schema?.is_primary_key) !== Boolean(expected.schema.is_primary_key) ||
      (expected.meta.required && !current.meta?.required) ||
      (expected.meta.validation && JSON.stringify(current.meta?.validation) !== JSON.stringify(expected.meta.validation))
    ) throw new Error(`Incompatible field ${collection}.${expected.field}.`);
  }
}

export async function ensureDefaultLayout(admin, collection, fields, sortField) {
  const presets = await admin.request(readPresets({ filter: {
    collection: { _eq: collection }, bookmark: { _null: true },
    user: { _null: true }, role: { _null: true },
  } }));
  if (presets.length === 0) {
    await admin.request(createPreset({
      collection,
      layout: "tabular",
      layout_query: { tabular: { fields, sort: [sortField] } },
    }));
  }
}

export async function withContentAdmin({ envFile = ".env", name }, configure) {
  try {
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
      await configure(admin, readerId);
    } finally {
      await admin.logout();
    }
    console.log(`Directus ${name} setup complete.`);
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : error?.errors?.map(({ extensions }) => extensions?.code ?? "UNKNOWN").join(", ") ?? "Unknown Directus error.";
    console.error(`Directus ${name} setup failed. ${message}`);
    process.exitCode = 1;
  }
}

export async function setupContentCollection({
  envFile, collection, name, fields, meta, listFields, seedEntries,
}) {
  await withContentAdmin({ envFile, name }, async (admin, readerId) => {
    await ensureCollection(admin, collection, fields, meta);
    if (seedEntries) {
      const existing = await admin.request(readItems(collection, { fields: ["id"], limit: 1 }));
      if (existing.length === 0) await admin.request(createItems(collection, seedEntries));
    }
    await ensureDefaultLayout(admin, collection, listFields, meta.sort_field);
    const policy = await ensurePolicy(admin, `Website ${name} reader`, {
      collection, action: "read", fields: fields.map(({ field }) => field),
    });
    await grantUserPolicy(admin, readerId, policy);
  });
}
