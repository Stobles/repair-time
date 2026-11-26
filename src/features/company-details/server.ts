import { readSingleton } from "@directus/sdk";
import { z } from "zod";
import { directus } from "@/shared/lib/directus/Directus";
import localContacts from "./model/localContacts.json";

const phoneSchema = z.string().trim()
  .regex(/^\+[1-9][\d .()\u00a0\u202f-]*$/)
  .refine((value) => /^\+[1-9]\d{6,14}$/.test(normalizePhone(value)));
const optionalIdentifier = (pattern: RegExp) => z.string().regex(pattern).or(z.literal("")).nullish();
const companyDetailsSchema = z.object({
  phone: phoneSchema,
  email: z.string().trim().pipe(z.email()),
  telegram_phone: phoneSchema,
  whatsapp_phone: phoneSchema,
  proprietor_name: z.string().trim().nullish(),
  inn: optionalIdentifier(/^\d{12}$/),
  ogrnip: optionalIdentifier(/^\d{15}$/),
});

const exampleRequisites = {
  proprietorName: "Иванов Иван Иванович",
  inn: "XXXXXXXXXXXX",
  ogrnip: "XXXXXXXXXXXXXXX",
  isExample: true,
};

function normalizePhone(phone: string) {
  return phone.replace(/[^+\d]/g, "");
}

export async function getCompanyDetails() {
  const content = directus
    ? await directus.request(readSingleton("company_details", {
      fields: ["id", "phone", "email", "telegram_phone", "whatsapp_phone", "proprietor_name", "inn", "ogrnip"],
    })).catch((cause: unknown) => {
      throw new Error("Failed to load company details. Run npm run directus:setup:company-details and check read permissions.", { cause });
    })
    : localContacts;

  if (directus && (!content || typeof content !== "object" || !("id" in content) || !content.id)) {
    throw new Error("Company details are missing. Run npm run directus:setup:company-details.");
  }

  const result = companyDetailsSchema.safeParse(content);
  if (!result.success) {
    const fields = new Set(result.error.issues.map(({ path }) => path.join(".")));
    throw new Error(`Invalid company details in fields: ${[...fields].join(", ")}.`);
  }

  const { phone, email, telegram_phone, whatsapp_phone, proprietor_name, inn, ogrnip } = result.data;
  return {
    phone,
    phoneHref: `tel:${normalizePhone(phone)}`,
    email,
    emailHref: `mailto:${email}`,
    telegramUrl: `https://t.me/${normalizePhone(telegram_phone)}`,
    whatsappUrl: `https://wa.me/${normalizePhone(whatsapp_phone).slice(1)}`,
    requisites: proprietor_name && inn && ogrnip
      ? { proprietorName: proprietor_name, inn, ogrnip, isExample: false }
      : exampleRequisites,
  };
}
