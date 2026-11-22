// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: "https://stobles.github.io",
  base: "/repair-time",

  env: {
    schema: {
      DIRECTUS_URL: envField.string({ context: "server", access: "secret", optional: true }),
      DIRECTUS_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
