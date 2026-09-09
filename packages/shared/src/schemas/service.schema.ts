import { z } from "zod";
import { describe } from "zod/v4/core";

export const createServiceSchema = z.object({
  name: z.string().min(3, "İsim en az 3 karakter olmalı"),
  durationMinutes: z.number().int().positive("Süre pozitif bir sayı olmalı"),
  price: z.number().nonnegative().optional(),
  describtion: z.string().optional(),
});
export type CreateServiceInput = z.infer<typeof createServiceSchema>;

export const updateServiceSchema = createServiceSchema.partial().extend({
  isActive: z.boolean().optional(),
});
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
