import { z } from "zod";

export const createBookingSchema = z
  .object({
    resourceId: z.string().uuid(),
    serviceId: z.string().uuid(),
    customerName: z.string().min(2, "Müşteri adı en az 2 karakter olmalı"),
    customerEmail: z.string().email("Geçerli bir e-posta girin"),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "Bitiş saati başlangıçtan sonra olmalı",
    path: ["endTime"],
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CreateBookingFormValues = z.input<typeof createBookingSchema>;

export const bookingStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
]);

export const updateBookingStatusSchema = z.object({
  status: bookingStatusSchema,
});

export type UpdateBookingStatusInput = z.infer<
  typeof updateBookingStatusSchema
>;
