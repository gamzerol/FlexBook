import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
        setError("root", { message: "E-posta veya şifre hatalı" });
      }
    }
  });

  return (
    <div className="bg-neutral-100 rounded-2xl p-5">
      <div className="flex flex-wrap rounded-xl overflow-hidden min-h-[440px]">
        {/* Sol panel - zaman çizelgesi */}
        <div className="flex-[1.3] min-w-[280px] bg-ink p-7 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-[18px] bg-accent rounded-sm" />
            <span className="font-display font-semibold text-[19px] text-paper">
              FlexBook
            </span>
          </div>

          <div className="flex flex-col">
            {["08:00", "09:00"].map((time) => (
              <div
                key={time}
                className="flex items-center gap-3 py-2 border-t border-white/10"
              >
                <span className="font-mono-time text-xs text-paper/45 w-11">
                  {time}
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            ))}
            <div className="flex items-center gap-3 py-2 px-2.5 border-t border-white/10 bg-accent rounded-md my-0.5">
              <span className="font-mono-time text-xs text-accent-ink w-11">
                10:00
              </span>
              <span className="font-sans text-[13px] text-accent-ink font-medium">
                Ayşe Yılmaz — Saç kesimi
              </span>
            </div>
            {["11:00", "12:00"].map((time) => (
              <div
                key={time}
                className="flex items-center gap-3 py-2 border-t border-white/10 last:border-b"
              >
                <span className="font-mono-time text-xs text-paper/45 w-11">
                  {time}
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            ))}
          </div>

          <p className="font-sans text-[13px] text-paper/55 m-0">
            Her sektör, tek takvim.
          </p>
        </div>

        {/* Sağ panel - form */}
        <div className="flex-1 min-w-[260px] bg-paper p-9 flex flex-col justify-center">
          <p className="font-display font-semibold text-[22px] text-ink m-0 mb-1">
            Giriş yap
          </p>
          <p className="font-sans text-[13px] text-neutral-500 m-0 mb-6">
            İşletmenin randevularını yönet.
          </p>

          <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
            <div>
              <label className="font-sans text-xs text-neutral-400 block mb-1.5">
                E-posta
              </label>
              <input
                type="email"
                placeholder="isletme@example.com"
                {...register("email")}
                className="w-full bg-transparent border-0 border-b border-neutral-300 rounded-none px-0.5 py-1.5 font-sans text-sm text-ink focus:outline-none focus:border-ink"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-sans text-xs text-neutral-400 block mb-1.5">
                Şifre
              </label>
              <input
                type="password"
                placeholder="Şifreniz"
                {...register("password")}
                className="w-full bg-transparent border-0 border-b border-neutral-300 rounded-none px-0.5 py-1.5 font-sans text-sm text-ink focus:outline-none focus:border-ink"
              />
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {errors.root && (
              <p className="text-xs text-red-600 -mt-2">
                {errors.root.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-accent text-accent-ink rounded-lg h-10 font-sans text-sm font-medium disabled:opacity-60"
            >
              {isSubmitting ? "Giriş yapılıyor..." : "Giriş yap"}
            </button>

            <p className="font-sans text-[13px] text-neutral-500 text-center m-0">
              Hesabın yok mu?{" "}
              <a href="/register" className="text-ink font-medium">
                Kayıt ol
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
