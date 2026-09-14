import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/api-client";

interface Business {
  id: string;
  name: string;
  slug: string;
  sector: string | null;
  email: string;
  timezone: string;
}

export function useCurrentBusiness() {
  return useQuery({
    queryKey: ["business", "me"],
    queryFn: () =>
      apiClient.get<Business>(
        "/api/v1/business/me",
      ) as unknown as Promise<Business>,
  });
}
