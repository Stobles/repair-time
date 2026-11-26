import { readItems } from "@directus/sdk";
import { z } from "zod";
import { directus } from "@/shared/lib/directus/Directus";
import { getDirectusAssetUrl } from "@/shared/lib/utils/getDirectusAssetUrl";
import { portfolioProjects, type PortfolioProject, type ProjectPhoto } from "../model/PortfolioProjects";

const requiredText = z.string().trim().min(1, "Enter a non-empty value.");
const optionalText = z.string().nullish().transform((value) => value?.trim() || undefined);
const photoSchema = z.object({
  file_id: z.object({
    id: z.uuid(),
    description: requiredText,
    type: z.string().startsWith("image/"),
    width: z.number().int().positive().nullable(),
    height: z.number().int().positive().nullable(),
  }),
});

const projectSchema = z.object({
  id: z.uuid(),
  title: requiredText,
  description: requiredText,
  preview_title: optionalText,
  preview_text: optionalText,
  badge: optionalText,
  specifications: z.array(z.object({
    label: requiredText,
    value: requiredText,
    highlight: z.boolean().nullish().transform((value) => value ?? false),
  })).nullish().transform((items) => items ?? []),
  photos: z.tuple([photoSchema], { error: "Add at least one image to the portfolio gallery." }).rest(photoSchema),
});

export async function getPortfolioProjects(): Promise<readonly PortfolioProject[]> {
  if (!directus) return portfolioProjects;

  const { url } = directus;
  const items = await directus.request(readItems("portfolio_projects", {
    fields: [
      "id", "title", "description", "preview_title", "preview_text", "badge", "specifications",
      { photos: [{ file_id: ["id", "description", "type", "width", "height"] }] },
    ],
    filter: { status: { _eq: "published" } },
    sort: ["sort", "id"],
    limit: -1,
    deep: { photos: { _sort: ["sort", "id"], _limit: -1 } },
  })).catch((cause: unknown) => {
    throw new Error("Failed to load portfolio projects from Directus. Check the schema and read permissions.", { cause });
  });

  if (items.length === 0) return portfolioProjects;
  return items.map((item) => {
    const result = projectSchema.safeParse(item);
    if (!result.success) {
      const details = result.error.issues.map(({ path, message }) => [path.join("."), message].filter(Boolean).join(": "));
      throw new Error(`Invalid portfolio project "${item.title}" (${item.id}). ${details.join("; ")}`);
    }

    const project = result.data;
    const toPhoto = ({ file_id: file }: z.infer<typeof photoSchema>): ProjectPhoto => ({
      image: {
        src: getDirectusAssetUrl(url, file.id),
        width: file.width ?? undefined,
        height: file.height ?? undefined,
      },
      alt: file.description,
    });
    const [firstPhoto, ...remainingPhotos] = project.photos;

    return {
      id: project.id,
      title: project.title,
      description: project.description,
      previewTitle: project.preview_title ?? project.title,
      previewText: project.preview_text,
      badge: project.badge,
      specifications: project.specifications,
      photos: [toPhoto(firstPhoto), ...remainingPhotos.map(toPhoto)],
    };
  });
}
