import { readSingleton } from "@directus/sdk";
import { directus } from "@/shared/lib/directus/Directus";
import sectionLabels from "@/shared/lib/directus/sectionLabels.json";

export async function getSectionVisibility() {
  const fields = Object.keys(sectionLabels) as (keyof typeof sectionLabels)[];
  const settings = directus && await directus.request(readSingleton("section_visibility", { fields }))
    .catch((cause: unknown) => {
      throw new Error("Failed to load section visibility. Run npm run directus:setup:section-visibility and check read permissions.", { cause });
    });

  return (section: keyof typeof sectionLabels) => settings?.[section] !== false;
}

export { sectionLabels };
