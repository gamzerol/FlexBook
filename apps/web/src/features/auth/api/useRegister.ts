import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../lib/api-client";
import { useAuthStore } from "../store/authStore";
import type { RegisterInput } from "@flexbook/shared";

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: RegisterInput) =>
      apiClient.post<{ accessToken: string }>(
        "/api/v1/auth/register",
        input,
      ) as unknown as Promise<{
        accessToken: string;
      }>,
    onSuccess: (data) => {
      // Kayit basarili olunca backend zaten token dondugu icin
      // ayrica login yapmaya gerek yok - dogrudan oturum aciliyor.
      setAuth(data.accessToken, null);
      navigate("/dashboard");
    },
  });
}
