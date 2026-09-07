import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../../lib/api-client";
import { useAuthStore } from "../store/authStore";
import type { LoginInput } from "@flexbook/shared";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: LoginInput) =>
      apiClient.post<{ accessToken: string }>(
        "/api/v1/auth/login",
        input,
      ) as unknown as Promise<{ accessToken: string }>,
    onSuccess: (data) => {
      // Not: user bilgisi backend'den ayrıca dönmeli (Bölüm 11'de eklenecek);
      // şimdilik sadece token set ediliyor.
      setAuth(data.accessToken, null);
      navigate("/dashboard");
    },
  });
}
