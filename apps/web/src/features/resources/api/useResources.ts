import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/api-client";

export interface Resource {
  id: string;
  name: string;
  type: "PERSON" | "ASSET";
  isActive: boolean;
}
export function useResources() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: () =>
      apiClient.get<Resource[]>("/api/v1/resources") as unknown as Promise<
        Resource[]
      >,
  });
}
