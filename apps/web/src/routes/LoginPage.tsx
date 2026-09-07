import { LoginForm } from "../features/auth/components/LoginForm";

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-page p-4">
      <div className="w-full max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
