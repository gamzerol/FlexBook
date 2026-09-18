import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/api-client";

export type BookingStatus =
  "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

export interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  resource: { id: string; name: string };
  service: { id: string; name: string };
  customer: { id: string; name: string; email: string };
}

interface BookingFilters {
  resourceId?: string;
  status?: BookingStatus;
  from?: string; // ISO
  to?: string; // ISO
}

export function useBookings(filters: BookingFilters = {}) {
  return useQuery({
    queryKey: ["bookings", filters],
    queryFn: () =>
      apiClient.get<Booking[]>("/api/v1/bookings", {
        params: filters,
      }) as unknown as Promise<Booking[]>,
  });
}
