import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  user: {
    id: string;
    email: string;
    role: "OWNER" | "STAFF";
  } | null;
  setAuth: (token: string, user: AuthState["user"]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  logout: () => set({ accessToken: null, user: null }),
}));
