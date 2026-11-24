import {
  createPermission, createPolicy, readPermissions, readPolicies, readUser, updateUser,
} from "@directus/sdk";

export async function ensurePolicy(admin, name, permission) {
  const policies = await admin.request(readPolicies({ filter: { name: { _eq: name } } }));
  if (policies.length > 1 || policies[0]?.admin_access || policies[0]?.app_access) {
    throw new Error(`Incompatible policy ${name}.`);
  }
  const policy = policies[0] ?? await admin.request(createPolicy({ name, admin_access: false, app_access: false }));
  const permissions = await admin.request(readPermissions({ filter: { policy: { _eq: policy.id } } }));
  if (permissions.length === 0) {
    await admin.request(createPermission({ policy: policy.id, ...permission }));
  } else {
    const [current] = permissions;
    if (
      permissions.length !== 1 || current.collection !== permission.collection ||
      current.action !== permission.action || current.fields?.length !== permission.fields.length ||
      !permission.fields.every((name) => current.fields.includes(name)) ||
      JSON.stringify(current.permissions ?? {}) !== JSON.stringify(permission.permissions ?? {})
    ) throw new Error(`Incompatible permission on policy ${name}.`);
  }
  return policy.id;
}

export async function grantUserPolicy(admin, userId, policyId) {
  const { policies } = await admin.request(readUser(userId, { fields: ["policies.policy"] }));
  if (!policies.some(({ policy }) => policy === policyId)) {
    await admin.request(updateUser(userId, { policies: { create: [{ policy: policyId }] } }));
  }
}
