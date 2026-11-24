import { readItems } from "@directus/sdk";
import { directus } from "@/shared/lib/directus/Directus";

export async function getPropertyTypes() {
  if (!directus) return [];

  const types = await directus.request(readItems("property_types", {
    fields: ["id", "name"],
    filter: { is_active: { _eq: true } },
    sort: ["sort", "id"],
    limit: -1,
  }));

  return types.map(({ id, name }) => ({ value: id, label: name }));
}
