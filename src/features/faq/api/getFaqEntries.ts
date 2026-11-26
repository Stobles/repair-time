import { readItems } from "@directus/sdk";
import { directus } from "@/shared/lib/directus/Directus";
import type { DirectusSchema } from "@/shared/lib/directus/DirectusSchema";
import localFaqEntries from "../model/localFaqEntries.json";

export type FaqEntry = Pick<DirectusSchema["faq_items"][number], "question" | "answer">;

export async function getFaqEntries(): Promise<readonly FaqEntry[]> {
  if (!directus) return localFaqEntries;

  try {
    const entries = await directus.request(readItems("faq_items", {
      fields: ["question", "answer"],
      sort: ["sort", "id"],
      limit: -1,
    }));
    return entries.length > 0 ? entries : localFaqEntries;
  } catch (cause) {
    throw new Error("Failed to load FAQ items from Directus. Check the collection and read permissions.", { cause });
  }
}
