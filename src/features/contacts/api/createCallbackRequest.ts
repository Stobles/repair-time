import { createItem, readItems } from "@directus/sdk";
import { callbackDirectus, directus } from "@/shared/lib/directus/Directus";
import type { CallbackFormValues } from "../model/CallbackFormSchema";

export async function createCallbackRequest({ name, phone, property, message }: CallbackFormValues) {
  if (!directus || !callbackDirectus) return "unavailable";

  const types = await directus.request(readItems("property_types", {
    fields: ["id"],
    filter: { id: { _eq: property }, is_active: { _eq: true } },
    limit: 1,
  }));
  if (types.length === 0) return "property_unavailable";

  await callbackDirectus.request(createItem("callback_requests", { name, phone, property, message }));
  return "created";
}
