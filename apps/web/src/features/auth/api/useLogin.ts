import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../../lib/api-client";
import { useAuthStore } from "../store/authStore";
import type { LoginInput } from "@flexbook/shared";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (input: LoginInput) =>
      apiClient.post<{ accessToken: string }>("/api/v1/auth/login", input),
    onSuccess: (data) => {
      // Not: user bilgisi backend'den ayrıca dönmeli (Bölüm 11'de eklenecek);
      // şimdilik sadece token set ediliyor.
      setAuth(data.data.accessToken, null);
    },
  });
}
