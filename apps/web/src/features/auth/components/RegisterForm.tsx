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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...payload } = data; // backend confirmPassword bilmiyor
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
    <div className="bg-paper rounded-2xl overflow-hidden shadow-xl shadow-black/5">
      <div className="flex flex-wrap min-h-[480px]">
        {/* Sol panel - zaman çizelgesi */}
        <div className="flex-[1.3] min-w-[280px] bg-ink p-8 flex flex-col justify-between">
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
                className="flex items-center gap-3 py-2.5 border-t border-white/10"
              >
                <span className="font-mono-time text-xs text-paper/45 w-11">
                  {time}
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            ))}
            <div className="flex items-center gap-3 py-2.5 px-3 border-t border-white/10 bg-accent rounded-md my-1">
              <span className="font-mono-time text-xs text-accent-ink w-11">
                10:00
              </span>
              <span className="font-sans text-[13px] text-accent-ink font-medium">
                Senin ilk randevun
              </span>
            </div>
            <div className="flex items-center gap-3 py-2.5 border-t border-white/10 border-b border-white/10">
              <span className="font-mono-time text-xs text-paper/45 w-11">
                11:00
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          </div>

          <p className="font-sans text-[13px] text-paper/55 m-0">
            2 dakikada işletmeni kur.
          </p>
        </div>

        {/* Sağ panel - form */}
        <div className="flex-1 min-w-[280px] bg-paper p-9 flex flex-col justify-center">
          <p className="font-display font-semibold text-[24px] text-ink m-0 mb-1">
            Hesap oluştur
          </p>
          <p className="font-sans text-sm text-neutral-500 m-0 mb-6">
            İşletmeni ücretsiz FlexBook'a taşı.
          </p>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-sans text-xs text-neutral-400 block mb-1.5">
                İşletme adı
              </label>
              <input
                placeholder="Studio Bella"
                {...register("name")}
                className="w-full bg-transparent border-0 border-b border-neutral-300 rounded-none px-0.5 py-1.5 font-sans text-sm text-ink focus:outline-none focus:border-ink"
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-sans text-xs text-neutral-400 block mb-1.5">
                Sektör
              </label>
              <select
                {...register("sector")}
                className="w-full bg-transparent border-0 border-b border-neutral-300 rounded-none px-0.5 py-1.5 font-sans text-sm text-ink focus:outline-none focus:border-ink"
              >
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

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

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="font-sans text-xs text-neutral-400 block mb-1.5">
                  Şifre
                </label>
                <input
                  type="password"
                  placeholder="En az 8 karakter"
                  {...register("password")}
                  className="w-full bg-transparent border-0 border-b border-neutral-300 rounded-none px-0.5 py-1.5 font-sans text-sm text-ink focus:outline-none focus:border-ink"
                />
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="font-sans text-xs text-neutral-400 block mb-1.5">
                  Şifre (tekrar)
                </label>
                <input
                  type="password"
                  placeholder="Tekrar girin"
                  {...register("confirmPassword")}
                  className="w-full bg-transparent border-0 border-b border-neutral-300 rounded-none px-0.5 py-1.5 font-sans text-sm text-ink focus:outline-none focus:border-ink"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {errors.root && (
              <p className="text-xs text-red-600 -mt-1">
                {errors.root.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-1 bg-accent text-accent-ink rounded-lg h-11 font-sans text-sm font-medium disabled:opacity-60"
            >
              {isSubmitting ? "Hesap oluşturuluyor..." : "Hesap oluştur"}
            </button>

            <p className="font-sans text-sm text-neutral-500 text-center m-0">
              Zaten hesabın var mı?{" "}
              <Link to="/login" className="text-ink font-medium">
                Giriş yap
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
