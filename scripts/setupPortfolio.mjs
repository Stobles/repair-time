import { isDeepStrictEqual } from "node:util";
import {
  createField, createFolder, createPermission, createRelation, readFieldsByCollection,
  readFolders, readPermissions, readRelationByCollection, updatePermission,
} from "@directus/sdk";
import { ensurePolicy, grantUserPolicy } from "./directusAccess.mjs";
import { ensureCollection, ensureDefaultLayout, translations, withContentAdmin } from "./directusContent.mjs";

const projects = "portfolio_projects";
const projectFiles = "portfolio_project_files";
const files = "directus_files";
const folderName = "Портфолио (публичные фото)";
// Directus 11's built-in public policy ID is shared across instances.
const publicPolicy = "abf8a154-5b1c-4a46-ac9c-7300570f4f17";
const published = { status: { _eq: "published" } };

const id = {
  field: "id", type: "uuid",
  schema: { is_primary_key: true, is_nullable: false },
  meta: { special: ["uuid"], hidden: true, readonly: true },
};
const sort = {
  field: "sort", type: "integer",
  schema: { is_nullable: true },
  meta: { hidden: true },
};

function textField(field, label, { multiline = false, required = false } = {}) {
  return {
    field,
    type: multiline ? "text" : "string",
    schema: { is_nullable: !required },
    meta: {
      interface: multiline ? "input-multiline" : "input",
      required,
      translations: translations(label),
      ...(required ? { validation: { _and: [{ [field]: { _regex: "\\S" } }] } } : {}),
    },
  };
}

const statusChoices = [
  { text: "Черновик", value: "draft" },
  { text: "Опубликован", value: "published" },
  { text: "В архиве", value: "archived" },
];

const projectFields = [
  id,
  textField("title", "Название", { required: true }),
  textField("description", "Описание", { multiline: true, required: true }),
  textField("preview_title", "Заголовок превью"),
  textField("preview_text", "Текст превью"),
  textField("badge", "Надпись над заголовком"),
  {
    field: "specifications", type: "json",
    schema: { is_nullable: true },
    meta: {
      interface: "list",
      translations: translations("Характеристики"),
      options: {
        template: "{{label}} — {{value}}",
        addLabel: "Добавить характеристику",
        fields: [
          { field: "label", name: "Название", type: "string", meta: { interface: "input", required: true } },
          { field: "value", name: "Значение", type: "string", meta: { interface: "input", required: true } },
          {
            field: "highlight", name: "Выделить", type: "boolean",
            schema: { default_value: false },
            meta: { interface: "boolean" },
          },
        ],
      },
    },
  },
  {
    field: "status", type: "string",
    schema: { is_nullable: false, default_value: "draft" },
    meta: {
      interface: "select-dropdown", required: true, translations: translations("Статус"),
      options: { choices: statusChoices },
      validation: { _and: [{ status: { _in: statusChoices.map(({ value }) => value) } }] },
    },
  },
  sort,
];

const junctionFields = [
  id,
  ...["project_id", "file_id"].map((field) => ({
    field, type: "uuid",
    schema: { is_nullable: false },
    meta: { special: ["m2o"], hidden: true },
  })),
  sort,
];

async function ensureFolder(admin) {
  const matching = await admin.request(readFolders({
    fields: ["id"],
    filter: { name: { _eq: folderName }, parent: { _null: true } },
    limit: 2,
  }));
  if (matching.length > 1) throw new Error(`Multiple root folders named "${folderName}".`);
  return (matching[0] ?? await admin.request(createFolder({ name: folderName }))).id;
}

async function ensureGallery(admin, folder) {
  const fields = await admin.request(readFieldsByCollection(projects));
  const photos = fields.find(({ field }) => field === "photos");
  if (!photos) {
    await admin.request(createField(projects, {
      field: "photos", type: "alias", schema: null,
      meta: {
        interface: "files", special: ["files"], translations: translations("Фотографии"),
        note: "Первое фото используется в превью. Заполните описание каждого файла для альтернативного текста.",
        options: { folder, filter: { folder: { _eq: folder } }, allowedMimeTypes: ["image/*"] },
      },
    }));
  } else if (photos.type !== "alias" || photos.meta?.interface !== "files" || photos.meta.options?.folder !== folder) {
    throw new Error(`Incompatible field ${projects}.photos.`);
  }

  const relations = await admin.request(readRelationByCollection(projectFiles));
  const expected = [
    {
      field: "file_id", related_collection: files,
      meta: { junction_field: "project_id" },
    },
    {
      field: "project_id", related_collection: projects,
      meta: { one_field: "photos", junction_field: "file_id", sort_field: "sort", one_deselect_action: "delete" },
    },
  ];
  for (const relation of expected) {
    const current = relations.find(({ field }) => field === relation.field);
    if (!current) {
      await admin.request(createRelation({ collection: projectFiles, ...relation, schema: { on_delete: "CASCADE" } }));
    } else if (
      current.related_collection !== relation.related_collection || current.schema?.on_delete !== "CASCADE" ||
      Object.entries(relation.meta).some(([key, value]) => current.meta?.[key] !== value)
    ) {
      throw new Error(`Incompatible relation ${projectFiles}.${relation.field}.`);
    }
  }
}

async function allowPublicPhotos(admin, folderFilter) {
  const match = await admin.request(readPermissions({
    filter: { policy: { _eq: publicPolicy }, collection: { _eq: files }, action: { _eq: "read" } },
    limit: 2,
  }));
  if (match.length > 1) throw new Error("Expected at most one public files read permission.");
  const [current] = match;
  if (!current) {
    await admin.request(createPermission({
      policy: publicPolicy, collection: files, action: "read", fields: ["id", "type"], permissions: folderFilter,
    }));
    return;
  }

  if (!current.permissions || Object.keys(current.permissions).length === 0) {
    throw new Error("Scope the existing public files read permission to public folders before setting up portfolio.");
  }
  const rules = Object.keys(current.permissions).length === 1 && Array.isArray(current.permissions._or)
    ? current.permissions._or : [current.permissions];
  if (!rules.some((rule) => isDeepStrictEqual(rule, folderFilter))) {
    await admin.request(updatePermission(current.id, { permissions: { _or: [...rules, folderFilter] } }));
  }
}

const [envFile] = process.argv.slice(2);
await withContentAdmin({ envFile, name: "portfolio" }, async (admin, readerId) => {
  const folder = await ensureFolder(admin);
  await ensureCollection(admin, projects, projectFields, {
    translations: translations("Проекты портфолио"),
    icon: "photo_library",
    display_template: "{{title}}",
    sort_field: "sort",
  });
  await ensureCollection(admin, projectFiles, junctionFields, { hidden: true });
  await ensureGallery(admin, folder);
  await ensureDefaultLayout(admin, projects, ["title", "status", "preview_text"], "sort");

  const folderFilter = { folder: { _eq: folder } };
  const readerPermissions = [
    {
      collection: projects,
      fields: [...projectFields.map(({ field }) => field), "photos"],
      permissions: published,
      name: "Website portfolio projects reader",
    },
    {
      collection: projectFiles,
      fields: junctionFields.map(({ field }) => field),
      permissions: { project_id: published },
      name: "Website portfolio gallery reader",
    },
    {
      collection: files,
      fields: ["id", "description", "type", "width", "height"],
      permissions: folderFilter,
      name: "Website portfolio photos reader",
    },
  ];
  for (const { name, ...permission } of readerPermissions) {
    const policy = await ensurePolicy(admin, name, { ...permission, action: "read" });
    await grantUserPolicy(admin, readerId, policy);
  }
  await allowPublicPhotos(admin, folderFilter);
});
