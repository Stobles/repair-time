import { readSingleton } from "@directus/sdk";
import { directus } from "@/shared/lib/directus/Directus";
import { toggleableSectionKeys } from "@/shared/lib/directus/sectionLabels";

export async function getSectionVisibility() {
  const settings = directus && await directus.request(readSingleton("section_visibility", { fields: toggleableSectionKeys }))
    .catch((cause: unknown) => {
      throw new Error("Failed to load section visibility. Run npm run directus:setup:section-visibility and check read permissions.", { cause });
    });

  return toggleableSectionKeys.filter((section) => settings?.[section] !== false);
}
