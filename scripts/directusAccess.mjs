import { isDeepStrictEqual } from "node:util";
import {
  createPermission, createPolicy, readPermissions, readPolicies, readUser, updatePermission, updateUser,
} from "@directus/sdk";

export async function ensurePolicy(admin, name, expectedPermissions, retiredFields = []) {
  const policies = await admin.request(readPolicies({ filter: { name: { _eq: name } } }));
  if (policies.length > 1 || policies[0]?.admin_access || policies[0]?.app_access) {
    throw new Error(`Incompatible policy ${name}.`);
  }
  const policy = policies[0] ?? await admin.request(createPolicy({ name, admin_access: false, app_access: false }));
  const permissions = await admin.request(readPermissions({ filter: { policy: { _eq: policy.id } } }));
  const expected = Array.isArray(expectedPermissions) ? expectedPermissions : [expectedPermissions];
  const matches = (current, permission) => current.collection === permission.collection && current.action === permission.action;
  if (permissions.some((current) => !expected.some((permission) => matches(current, permission)))) {
    throw new Error(`Incompatible permission on policy ${name}.`);
  }

  for (const permission of expected) {
    const existing = permissions.filter((current) => matches(current, permission));
    if (existing.length === 0) {
      await admin.request(createPermission({ policy: policy.id, ...permission }));
      continue;
    }

    const [current] = existing;
    const activeFields = current.fields?.filter((field) => !retiredFields.includes(field));
    if (
      existing.length !== 1 || activeFields?.length !== permission.fields.length ||
      !permission.fields.every((name) => activeFields.includes(name)) ||
      JSON.stringify(current.permissions ?? {}) !== JSON.stringify(permission.permissions ?? {})
    ) throw new Error(`Incompatible permission on policy ${name}.`);
    if (current.fields.length !== activeFields.length) {
      await admin.request(updatePermission(current.id, { fields: permission.fields }));
    }
  }
  return policy.id;
}

export async function grantUserPolicy(admin, userId, policyId) {
  const { policies } = await admin.request(readUser(userId, { fields: ["policies.policy"] }));
  if (!policies.some(({ policy }) => policy === policyId)) {
    await admin.request(updateUser(userId, { policies: { create: [{ policy: policyId }] } }));
  }
}

// Directus 11's built-in public policy ID is shared across instances.
const publicPolicy = "abf8a154-5b1c-4a46-ac9c-7300570f4f17";
const files = "directus_files";

export async function allowPublicFiles(admin, folderFilter) {
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
    throw new Error("Scope the existing public files read permission to public folders before granting public access.");
  }
  const rules = Object.keys(current.permissions).length === 1 && Array.isArray(current.permissions._or)
    ? current.permissions._or : [current.permissions];
  if (!rules.some((rule) => isDeepStrictEqual(rule, folderFilter))) {
    await admin.request(updatePermission(current.id, { permissions: { _or: [...rules, folderFilter] } }));
  }
}
