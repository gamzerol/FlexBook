import { z } from "zod";

export const createResourceSchema = z.object({
  name: z.string().min(3, "İsim en az 3 karakter olmalı"),
  type: z.enum(["PERSON", "ASSET"]).default("PERSON"),
});
export type createResourceInput = z.infer<typeof createResourceSchema>;

export const updateResourceSchema = createResourceSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type updateResourceInput = z.infer<typeof updateResourceSchema>;
