import { z } from "zod";

const pricingItemSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price_from: z.number().int().positive(),
  price_unit: z.enum(["square_meter", "item", "job"]),
  is_featured: z.boolean(),
  features: z.array(z.object({
    label: z.string().trim().min(1),
    unavailable: z.boolean().default(false),
  })).min(1, "Add at least one work item."),
}).transform(({ title, description, price_from, price_unit, is_featured, features }) => ({
  title,
  description,
  priceFrom: price_from,
  priceUnit: price_unit,
  isFeatured: is_featured,
  features,
}));

type PricingItem = z.output<typeof pricingItemSchema>;

export { pricingItemSchema, type PricingItem };
