import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { z } from "zod";
import { registerSchema } from "@flexbook/shared";
import { useRegister } from "../api/useRegister";
import { ApiError } from "../../../lib/api-client";

const registerFormSchema = registerSchema
  .extend({ confirmPassword: z.string() })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

type RegisterFormInput = z.infer<typeof registerFormSchema>;

const SECTORS = ["Kuaför / Güzellik", "Danışmanlık", "Toplantı odası", "Diğer"];

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({ resolver: zodResolver(registerFormSchema) });

  const registerBusiness = useRegister();

  const onSubmit = handleSubmit(async (data) => {
    const { ...payload } = data;
    try {
      await registerBusiness.mutateAsync(payload);
    } catch (err) {
      if (err instanceof ApiError) {
        setError("root", {
          message: err.message || "Kayıt sırasında bir hata oluştu.",
        });
      }
    }
  });

  return (
    <div className="w-[400px] bg-surface rounded-2xl border border-border-subtle shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] p-9">
      <div className="flex items-center gap-2 mb-7">
        <div className="w-[22px] h-[22px] rounded-md bg-accent flex items-center justify-center">
          <div className="w-2 h-2 rounded-sm bg-white" />
        </div>
        <span className="font-bold text-base text-ink">FlexBook</span>
      </div>

      <p className="font-semibold text-xl text-ink m-0 mb-1">Hesap oluştur</p>
      <p className="text-[13px] text-text-muted m-0 mb-6">
        İşletmeni ücretsiz FlexBook'a taşı
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <div>
          <label className="text-xs font-medium text-text-secondary block mb-1.5">
            İşletme adı
          </label>
          <input
            placeholder="Studio Bella"
            {...register("name")}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary block mb-1.5">
            Sektör
          </label>
          <select
            {...register("sector")}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          >
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

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

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-medium text-text-secondary block mb-1.5">
              Şifre
            </label>
            <input
              type="password"
              placeholder="En az 8 karakter"
              {...register("password")}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-text-secondary block mb-1.5">
              Şifre (tekrar)
            </label>
            <input
              type="password"
              placeholder="Tekrar girin"
              {...register("confirmPassword")}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {errors.root && (
          <p className="text-xs text-red-600 -mt-1">{errors.root.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-1.5 bg-ink text-white rounded-lg h-10 text-sm font-semibold disabled:opacity-60"
        >
          {isSubmitting ? "Hesap oluşturuluyor..." : "Hesap oluştur"}
        </button>

        <p className="text-[13px] text-text-muted text-center m-0 mt-1">
          Zaten hesabın var mı?{" "}
          <Link to="/login" className="text-ink font-semibold">
            Giriş yap
          </Link>
        </p>
      </form>
    </div>
  );
}
