import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./routes/LoginPage";
import { RegisterPage } from "./routes/RegisterPage";
import { DashboardHomePage } from "./routes/DashboardHomePage";
import { ComingSoonPage } from "./routes/ComingSoonPage";
import { ProtectedRoute } from "./app/ProtectedRoute";
import { DashboardLayout } from "./app/DashboardLayout";
import { bootstrapSession } from "./lib/api-client";

function App() {
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    bootstrapSession().finally(() => setIsBootstrapping(false));
  }, []);

  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page">
        <p className="font-sans text-sm text-neutral-400">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHomePage />} />
          <Route
            path="resources"
            element={<ComingSoonPage title="Kaynaklar" />}
          />
          <Route
            path="services"
            element={<ComingSoonPage title="Hizmetler" />}
          />
          <Route
            path="availability"
            element={<ComingSoonPage title="Müsaitlik" />}
          />
          <Route
            path="customers"
            element={<ComingSoonPage title="Müşteriler" />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
