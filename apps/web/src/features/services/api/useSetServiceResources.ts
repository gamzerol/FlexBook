import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../lib/api-client";

export function useSetServiceResources() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, resourceIds }: { serviceId: string; resourceIds: string[] }) =>
      apiClient.put(`/api/v1/services/${serviceId}/resources`, { resourceIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
