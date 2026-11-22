import { createDirectus, rest, staticToken } from "@directus/sdk";
import { env } from "../env";
import type { DirectusSchema } from "./DirectusSchema";

const { DIRECTUS_URL, DIRECTUS_TOKEN } = env;

export const directus = DIRECTUS_URL && DIRECTUS_TOKEN
  ? createDirectus<DirectusSchema>(DIRECTUS_URL).with(staticToken(DIRECTUS_TOKEN)).with(rest())
  : undefined;
