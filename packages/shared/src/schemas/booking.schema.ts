import { z } from "zod";

// Turkiye cep telefonu formati: 05XXXXXXXXX, 5XXXXXXXXX veya +905XXXXXXXXX
const PHONE_REGEX = /^(\+90|0)?5\d{9}$/;

export const createBookingSchema = z
  .object({
    resourceId: z.string().uuid(),
    serviceId: z.string().uuid(),
    customerName: z.string().min(2, "Müşteri adı en az 2 karakter olmalı"),
    customerPhone: z.string().regex(PHONE_REGEX, "Geçerli bir cep telefonu girin (05XX XXX XX XX)"),
    startTime: z.coerce.date<string>(),
    endTime: z.coerce.date<string>(),
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

export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
