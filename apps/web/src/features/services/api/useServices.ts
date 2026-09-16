import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/api-client";

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: string | null;
  description: string | null;
  isActive: boolean;
  resources: { resource: { id: string; name: string } }[];
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: () =>
      apiClient.get<Service[]>("/api/v1/services") as unknown as Promise<
        Service[]
      >,
  });
}
