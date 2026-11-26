import { readSingleton } from "@directus/sdk";
import { baseHref } from "@/shared/lib/BasePath";
import { directus } from "@/shared/lib/directus/Directus";
import { getDirectusAssetUrl } from "@/shared/lib/utils/getDirectusAssetUrl";
import local from "./model/localAdvantages.json";

export async function getAdvantages() {
  const content = directus && await directus.request(readSingleton("advantages_section"))
    .catch((cause: unknown) => {
      throw new Error("Failed to load advantages. Check Directus setup and read permissions.", { cause });
    });
  return {
    eyebrow: content?.eyebrow ?? local.eyebrow,
    title: content?.title ?? local.title,
    description: content?.description ?? local.description,
    cards: ([1, 2, 3, 4] as const).map((slot) => {
      const icon = content?.[`card_${slot}_icon`];
      return {
        title: content?.[`card_${slot}_title`] ?? local[`card_${slot}_title`],
        description: content?.[`card_${slot}_description`] ?? local[`card_${slot}_description`],
        caption: content?.[`card_${slot}_caption`] ?? local[`card_${slot}_caption`],
        iconUrl: directus && icon
          ? getDirectusAssetUrl(directus.url, icon)
          : `${baseHref}icons/advantages/${local[`card_${slot}_icon`]}`,
      };
    }),
  };
}
