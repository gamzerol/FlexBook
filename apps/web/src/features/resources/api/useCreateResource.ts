import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../lib/api-client";
import type { CreateResourceInput } from "@flexbook/shared";

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateResourceInput) =>
      apiClient.post("/api/v1/resources", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}
