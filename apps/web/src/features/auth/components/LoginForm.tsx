import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { loginSchema, type LoginInput } from "@flexbook/shared";
import { useLogin } from "../api/useLogin";
import { ApiError } from "../../../lib/api-client";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const login = useLogin();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login.mutateAsync(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError("root", { message: "E-posta veya şifre hatalı." });
      }
    }
  });

  return (
    <div className="w-[360px] bg-surface rounded-2xl border border-border-subtle shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] p-9">
      <div className="flex items-center gap-2 mb-7">
        <div className="w-[22px] h-[22px] rounded-md bg-accent flex items-center justify-center">
          <div className="w-2 h-2 rounded-sm bg-white" />
        </div>
        <span className="font-bold text-base text-ink">FlexBook</span>
      </div>

      <p className="font-semibold text-xl text-ink m-0 mb-1">
        Tekrar hoş geldin
      </p>
      <p className="text-[13px] text-text-muted m-0 mb-6">Hesabına giriş yap</p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <div>
          <label className="text-xs font-medium text-text-secondary block mb-1.5">
            E-posta
          </label>
          <input
            type="email"
            placeholder="isletme@example.com"
            {...register("email")}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary block mb-1.5">
            Şifre
          </label>
          <input
            type="password"
            placeholder="Şifreniz"
            {...register("password")}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p className="text-xs text-red-600 -mt-1">{errors.root.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-1.5 bg-ink text-white rounded-lg h-10 text-sm font-semibold disabled:opacity-60"
        >
          {isSubmitting ? "Giriş yapılıyor..." : "Giriş yap"}
        </button>

        <p className="text-[13px] text-text-muted text-center m-0 mt-1">
          Hesabın yok mu?{" "}
          <Link to="/register" className="text-ink font-semibold">
            Kayıt ol
          </Link>
        </p>
      </form>
    </div>
  );
}
