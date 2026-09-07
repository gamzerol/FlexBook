import { Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/store/authStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}
