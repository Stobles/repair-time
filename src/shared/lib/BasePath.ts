import { env } from "./env";

export const baseHref = env.BASE_URL.replace(/\/?$/, "/");
