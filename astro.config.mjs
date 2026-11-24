// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";

const site = "https://stobles.github.io";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: node({ mode: "standalone" }),
  site,
  base: "/repair-time",

  security: {
    allowedDomains: [
      { hostname: "localhost", protocol: "http" },
      { hostname: "127.0.0.1", protocol: "http" },
      { hostname: new URL(site).hostname, protocol: "https" },
    ],
  },

  env: {
    schema: {
      DIRECTUS_URL: envField.string({ context: "server", access: "secret", optional: true }),
      DIRECTUS_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
      DIRECTUS_CALLBACK_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
