import { readItems } from "@directus/sdk";
import { directus } from "@/shared/lib/directus/Directus";
import type { DirectusSchema } from "@/shared/lib/directus/DirectusSchema";
import localReviews from "../model/localReviews.json";
import type { Review } from "../types/Review";

type ReviewContent = Pick<DirectusSchema["reviews"][number], "author" | "quote" | "rating" | "details">;

const avatarColors = ["dark", "accent", "muted"] as const;

function toReview({ author, quote, rating, details }: ReviewContent, index: number): Review {
  const name = author.trim();
  const words = name.split(/\s+/u);
  const initialsWords = words.length > 1 ? [words[0], words[words.length - 1]] : words;

  return {
    author: name,
    initials: initialsWords.map((word) => Array.from(word)[0]).join("").toLocaleUpperCase("ru"),
    avatarColor: avatarColors[index % avatarColors.length],
    rating,
    quote,
    details: details?.trim() ?? "",
  };
}

export async function getReviews(): Promise<readonly Review[]> {
  if (!directus) return localReviews.map(toReview);

  try {
    const reviews = await directus.request(readItems("reviews", {
      fields: ["author", "quote", "rating", "details"],
      sort: ["sort", "id"],
      limit: -1,
    }));
    return reviews.map(toReview);
  } catch (cause) {
    throw new Error("Failed to load reviews from Directus. Check the reviews collection and read permissions.", { cause });
  }
}
