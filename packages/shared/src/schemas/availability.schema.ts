import { z } from "zod";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const availabilityRuleSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string().regex(TIME_REGEX, "Saat formatı HH:mm olmalı"),
    endTime: z.string().regex(TIME_REGEX, "Saat formatı HH:mm olmalı"),
  })
  .refine((rule) => rule.startTime < rule.endTime, {
    message: "Bitiş saati başlangıçtan sonra olmalı",
    path: ["endTime"],
  });
export const setAvailabilitySchema = z.array(availabilityRuleSchema).refine(
  (rules) => {
    const byDay = new Map<number, typeof rules>();
    for (const rule of rules) {
      byDay.set(rule.dayOfWeek, [...(byDay.get(rule.dayOfWeek) ?? []), rule]);
    }
    for (const dayRules of byDay.values()) {
      const sorted = [...dayRules].sort((a, b) =>
        a.startTime.localeCompare(b.startTime),
      );
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].startTime < sorted[i - 1].endTime) return false;
      }
    }
    return true;
  },
  { message: "Aynı gün içinde çakışan zaman aralıkları olamaz" },
);

export type SetAvailabilityInput = z.infer<typeof setAvailabilitySchema>;
export type AvailabilityRuleInput = z.infer<typeof availabilityRuleSchema>;
