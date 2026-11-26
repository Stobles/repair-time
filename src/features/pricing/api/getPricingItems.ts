import { readItems } from "@directus/sdk";
import { directus } from "@/shared/lib/directus/Directus";
import localPricingItems from "../model/localPricingItems.json";
import { pricingItemSchema, type PricingItem } from "../model/PricingItem";

export async function getPricingItems(): Promise<readonly PricingItem[]> {
  const localItems = () => localPricingItems.map((item) => pricingItemSchema.parse(item));
  if (!directus) return localItems();

  const items = await directus.request(readItems("pricing_items", {
    fields: ["id", "title", "description", "price_from", "price_unit", "is_featured", "features"],
    sort: ["sort", "id"],
    limit: -1,
  })).catch((cause: unknown) => {
    throw new Error("Failed to load pricing items from Directus. Check the collection and read permissions.", { cause });
  });

  if (items.length === 0) return localItems();
  return items.map((item) => {
    const result = pricingItemSchema.safeParse(item);
    if (!result.success) {
      const details = result.error.issues.map(({ path, message }) => `${path.join(".")}: ${message}`).join("; ");
      throw new Error(`Invalid pricing item "${item.title}" (${item.id}). ${details}`);
    }
    return result.data;
  });
}
