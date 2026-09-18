import type { BookingStatus } from "../api/useBookings";

export const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Bekliyor",
  CONFIRMED: "Onaylandı",
  CANCELLED: "İptal edildi",
  COMPLETED: "Tamamlandı",
  NO_SHOW: "Gelmedi",
};

export const NEXT_ACTIONS: Record<
  BookingStatus,
  { label: string; status: BookingStatus }[]
> = {
  PENDING: [
    { label: "Onayla", status: "CONFIRMED" },
    { label: "İptal et", status: "CANCELLED" },
  ],
  CONFIRMED: [
    { label: "Tamamlandı olarak işaretle", status: "COMPLETED" },
    { label: "Gelmedi olarak işaretle", status: "NO_SHOW" },
    { label: "İptal et", status: "CANCELLED" },
  ],
  CANCELLED: [],
  COMPLETED: [],
  NO_SHOW: [],
};
