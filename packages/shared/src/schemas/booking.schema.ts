import { z } from "zod";

export const createBookingSchema = z.object({
  resourceId: z.string().uuid(),
  serviceId: z.string().uuid(),
  customerId: z.string().uuid(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
