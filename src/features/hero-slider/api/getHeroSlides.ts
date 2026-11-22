import { readItems } from "@directus/sdk";
import { directus } from "@/shared/lib/directus/Directus";
import { getDirectusAssetUrl } from "@/shared/lib/utils/getDirectusAssetUrl";
import { heroSlides } from "../model/localHeroSlides";
import type { HeroSlide, HeroSlideFields } from "../types/heroSlide";

export async function getHeroSlides(): Promise<readonly HeroSlide[]> {
  if (!directus) return heroSlides;

  try {
    const slides = await directus.request(
      readItems("hero_slides", {
        fields: [
          "badge",
          "title",
          "description",
          "image_alt",
          { image: ["id", "width", "height"], mobile_image: ["id"] },
        ],
        filter: { status: { _eq: "published" } },
        sort: ["sort", "id"],
        limit: -1,
      }),
    );

    return mapHeroSlides(slides, directus.url);
  } catch (error) {
    const cause =
      error instanceof Error
        ? error.message
        : "Check Directus access and schema.";
    throw new Error(`Failed to load Hero slides from Directus. ${cause}`);
  }
}

function mapHeroSlides(
  slides: readonly HeroSlideFields[],
  directusUrl: URL,
): HeroSlide[] {
  return slides.map(
    ({ badge, title, description, image, mobile_image, image_alt }) => ({
      badge: badge?.trim(),
      title,
      description,
      image: {
        src: getDirectusAssetUrl(directusUrl, image.id),
        width: image.width ?? undefined,
        height: image.height ?? undefined,
      },
      mobileImageSrc: mobile_image
        ? getDirectusAssetUrl(directusUrl, mobile_image.id)
        : undefined,
      alt: image_alt,
    }),
  );
}
