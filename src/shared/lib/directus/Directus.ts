import { createDirectus, rest, staticToken } from "@directus/sdk";
import { env } from "../env";
import type { DirectusSchema } from "./DirectusSchema";

const { DIRECTUS_URL, DIRECTUS_TOKEN, DIRECTUS_CALLBACK_TOKEN } = env;

function createClient(url: string | undefined, token: string | undefined) {
  if (!url || !token) return undefined;

  return createDirectus<DirectusSchema>(url, {
    globals: {
      fetch: (input, init) => fetch(input, {
        ...init,
        signal: init?.signal ?? AbortSignal.timeout(8_000),
      }),
    },
  }).with(staticToken(token)).with(rest());
}

export const directus = createClient(DIRECTUS_URL, DIRECTUS_TOKEN);
export const callbackDirectus = createClient(DIRECTUS_URL, DIRECTUS_CALLBACK_TOKEN);
