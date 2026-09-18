import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createBookingSchema,
  type CreateBookingInput,
  type CreateBookingFormValues,
} from "@flexbook/shared";
import { useCreateBooking } from "../api/useCreateBooking";
import { useResources } from "../../resources/api/useResources";
import { useServices } from "../../services/api/useServices";
import { ApiError } from "../../../lib/api-client";

export function CreateBookingModal({ onClose }: { onClose: () => void }) {
  const { data: resources } = useResources();
  const { data: services } = useServices();
  const createBooking = useCreateBooking();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateBookingFormValues, unknown, CreateBookingInput>({
    resolver: zodResolver(createBookingSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createBooking.mutateAsync(data);
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setError("root", { message: err.message });
      }
    }
  });

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl border border-border w-full max-w-md p-6">
        <p className="font-semibold text-lg text-ink m-0 mb-4">
          Yeni rezervasyon
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-text-secondary block mb-1.5">
                Kaynak
              </label>
              <select
                {...register("resourceId")}
                className="w-full bg-page border-0 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                <option value="">Seç...</option>
                {resources?.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              {errors.resourceId && (
                <p className="text-xs text-red-600 mt-1">Kaynak seçmelisin</p>
              )}
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-text-secondary block mb-1.5">
                Hizmet
              </label>
              <select
                {...register("serviceId")}
                className="w-full bg-page border-0 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                <option value="">Seç...</option>
                {services?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.serviceId && (
                <p className="text-xs text-red-600 mt-1">Hizmet seçmelisin</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-text-secondary block mb-1.5">
                Başlangıç
              </label>
              <input
                type="datetime-local"
                {...register("startTime")}
                className="w-full bg-page border-0 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-text-secondary block mb-1.5">
                Bitiş
              </label>
              <input
                type="datetime-local"
                {...register("endTime")}
                className="w-full bg-page border-0 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              {errors.endTime && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">
              Müşteri adı
            </label>
            <input
              placeholder="Ayşe Yılmaz"
              {...register("customerName")}
              className="w-full bg-page border-0 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            {errors.customerName && (
              <p className="text-xs text-red-600 mt-1">
                {errors.customerName.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">
              Müşteri e-posta
            </label>
            <input
              type="email"
              placeholder="ayse@example.com"
              {...register("customerEmail")}
              className="w-full bg-page border-0 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            {errors.customerEmail && (
              <p className="text-xs text-red-600 mt-1">
                {errors.customerEmail.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p className="text-xs text-red-600 -mt-1">{errors.root.message}</p>
          )}

          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-text-muted px-3 py-2"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-ink text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {isSubmitting ? "Oluşturuluyor..." : "Rezervasyon oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
