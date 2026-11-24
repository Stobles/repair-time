import { DIRECTUS_CALLBACK_TOKEN, DIRECTUS_TOKEN, DIRECTUS_URL } from "astro:env/server";
import { z } from "zod";

const optionalString = z.string().trim().optional().transform((value) => value || undefined);

const envSchema = z.object({
  BASE_URL: z.string().startsWith("/"),
  DIRECTUS_URL: optionalString.pipe(z.url({ protocol: /^https?$/ }).optional()),
  DIRECTUS_TOKEN: optionalString,
  DIRECTUS_CALLBACK_TOKEN: optionalString,
}).refine(({ DIRECTUS_URL, DIRECTUS_TOKEN }) => Boolean(DIRECTUS_URL) === Boolean(DIRECTUS_TOKEN), {
  error: "Directus requires both DIRECTUS_URL and DIRECTUS_TOKEN.",
}).refine(({ DIRECTUS_URL, DIRECTUS_CALLBACK_TOKEN }) => !DIRECTUS_CALLBACK_TOKEN || Boolean(DIRECTUS_URL), {
  path: ["DIRECTUS_CALLBACK_TOKEN"],
  error: "Requires DIRECTUS_URL and DIRECTUS_TOKEN.",
});

const result = envSchema.safeParse({
  BASE_URL: import.meta.env.BASE_URL,
  DIRECTUS_URL,
  DIRECTUS_TOKEN,
  DIRECTUS_CALLBACK_TOKEN,
});

if (!result.success) {
  const issues = result.error.issues.map(({ path, message }) =>
    path.length ? `${path.join(".")}: ${message}` : message,
  );
  throw new Error(`Invalid environment configuration.\n${issues.join("\n")}`);
}

export const env = result.data;
