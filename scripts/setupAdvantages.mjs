import { readFile } from "node:fs/promises";
import {
  createFolder, createRelation, readFiles, readFolders, readRelationByCollection,
  readSingleton, updateSingleton, uploadFiles,
} from "@directus/sdk";
import { ensureCollection, translations, withContentAdmin } from "./directusContent.mjs";
import { allowPublicFiles, ensurePolicy, grantUserPolicy } from "./directusAccess.mjs";
import local from "../src/features/advantages/model/localAdvantages.json" with { type: "json" };

const collection = "advantages_section";
const folderName = "Преимущества — иконки";
const labels = {
  eyebrow: "Надзаголовок", title: "Заголовок", description: "Описание", caption: "Подпись", icon: "Иконка",
};
const slots = [1, 2, 3, 4];
const textField = (field, kind, sort, group = null) => ({
  field, type: kind === "description" ? "text" : "string",
  schema: { is_nullable: false },
  meta: {
    group, sort, required: true, translations: translations(labels[kind]),
    interface: kind === "description" ? "input-multiline" : "input",
  },
});

function collectionFields(folder) {
  return [
    {
      field: "id", type: "uuid",
      schema: { is_primary_key: true, is_nullable: false },
      meta: { special: ["uuid"], hidden: true, readonly: true },
    },
    ...["eyebrow", "title", "description"].map((kind, index) => textField(kind, kind, index + 1)),
    ...slots.map((slot) => ({
      field: `card_${slot}`, type: "alias", schema: null,
      meta: {
        interface: "group-detail", special: ["alias", "no-data", "group"],
        translations: translations(`Карточка ${slot}`), sort: slot + 3,
      },
    })),
    ...slots.flatMap((slot) => {
      const group = `card_${slot}`;
      return [
        ...["title", "description", "caption"].map((kind, index) => textField(`${group}_${kind}`, kind, index + 1, group)),
        {
          field: `${group}_icon`, type: "uuid", schema: { is_nullable: true },
          meta: {
            group, sort: 4, interface: "file-image", special: ["file"],
            translations: translations(labels.icon), options: { folder },
          },
        },
      ];
    }),
  ];
}

async function ensureIcon(admin, folder, filename) {
  const matches = await admin.request(readFiles({
    fields: ["id"], limit: 2,
    filter: { folder: { _eq: folder }, filename_download: { _eq: filename } },
  }));
  if (matches.length > 1) throw new Error(`Duplicate advantage icon: ${filename}`);
  if (matches[0]) return matches[0].id;
  const content = await readFile(new URL(`../public/icons/advantages/${filename}`, import.meta.url));
  const form = new FormData();
  form.append("folder", folder);
  form.append("file", new Blob([content], { type: "image/svg+xml" }), filename);
  return (await admin.request(uploadFiles(form))).id;
}

await withContentAdmin({ envFile: process.argv[2], name: "advantages" }, async (admin, readerId) => {
  const folders = await admin.request(readFolders({
    fields: ["id"], limit: 2, filter: { name: { _eq: folderName }, parent: { _null: true } },
  }));
  if (folders.length > 1) throw new Error(`Multiple folders named ${folderName}`);
  const { id: folder } = folders[0] ?? await admin.request(createFolder({ name: folderName }));
  const fields = collectionFields(folder);
  await ensureCollection(admin, collection, fields, {
    singleton: true, icon: "verified", translations: translations("Преимущества"),
  });

  const relations = await admin.request(readRelationByCollection(collection));
  for (const slot of slots) {
    const field = `card_${slot}_icon`;
    const relation = relations.find((entry) => entry.field === field);
    if (!relation) {
      await admin.request(createRelation({
        collection, field, related_collection: "directus_files", schema: { on_delete: "SET NULL" },
      }));
    } else if (relation.related_collection !== "directus_files" || relation.schema?.on_delete !== "SET NULL") {
      throw new Error(`Incompatible relation ${collection}.${field}`);
    }
  }

  const settings = await admin.request(readSingleton(collection, { fields: ["id"] }));
  const icons = {};
  for (const slot of slots) {
    const field = `card_${slot}_icon`;
    icons[field] = await ensureIcon(admin, folder, local[field]);
  }
  if (!settings?.id) await admin.request(updateSingleton(collection, { ...local, ...icons }));

  await allowPublicFiles(admin, { folder: { _eq: folder } });
  const policy = await ensurePolicy(admin, "Website advantages reader", {
    collection, action: "read", fields: fields.filter(({ schema }) => schema).map(({ field }) => field),
  });
  await grantUserPolicy(admin, readerId, policy);
});
