import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../lib/api-client";
import type { SetAvailabilityInput } from "@flexbook/shared";

export function useSetAvailability(resourceId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rules: SetAvailabilityInput) =>
      apiClient.put(`/api/v1/resources/${resourceId}/availability`, rules),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability", resourceId] });
    },
  });
}
