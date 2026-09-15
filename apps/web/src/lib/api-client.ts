import axios from "axios";
import { useAuthStore } from "../features/auth/store/authStore";

export class ApiError extends Error {
  public code: string;
  public details?: unknown;
  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/refresh`,
        {},
        { withCredentials: true },
      )
      .then((res) => {
        const newToken = res.data.data.accessToken;
        useAuthStore.getState().setAuth(newToken, useAuthStore.getState().user);
        return newToken;
      })
      .catch((err) => {
        useAuthStore.getState().logout();
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response.data.data,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const newToken = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    }
    const envelope = error.response?.data;
    if (envelope?.error) {
      throw new ApiError(
        envelope.error.code,
        envelope.error.message,
        envelope.error.details,
      );
    }
    throw error;
  },
);

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapSession(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = refreshAccessToken()
      .catch(() => {
        //geçerli oturum yok
      })
      .then(() => undefined);
  }
  return bootstrapPromise;
}

export async function logout() {
  try {
    await apiClient.post("/api/v1/auth/logout");
  } catch {
    //backend'e ulaşamasak bile local state'i temizlemeye devam ediyoruz
  } finally {
    useAuthStore.getState().logout();
  }
}
