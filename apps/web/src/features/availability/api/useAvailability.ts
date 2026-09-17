import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/api-client";

export interface AvailabilityRule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export function useAvailability(resourceId: string | null) {
  return useQuery({
    queryKey: ["availability", resourceId],
    queryFn: () =>
      apiClient.get<AvailabilityRule[]>(
        `api/v1/resources/${resourceId}/availability`,
      ) as unknown as Promise<AvailabilityRule[]>,
    enabled: !!resourceId,
  });
}
