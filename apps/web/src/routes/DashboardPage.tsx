import { logout } from "../lib/api-client";

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center">
      <div className="bg-paper rounded-2xl p-10 text-center max-w-sm">
        <p className="font-display text-2xl text-ink mb-2">Giriş başarılı</p>
        <p className="font-sans text-sm text-neutral-500 mb-6">
          Dashboard tasarımını bir sonraki adımda yapacağız.
        </p>
        <button
          onClick={() => logout()}
          className="font-sans text-sm text-ink underline"
        >
          Çıkış yap
        </button>
      </div>
    </div>
  );
}
