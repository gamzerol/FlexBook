import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createServiceSchema, type CreateServiceInput } from "@flexbook/shared";
import { IconTrash, IconChevronDown } from "@tabler/icons-react";
import { useServices } from "../api/useServices";
import { useCreateService } from "../api/useCreateService";
import { useDeleteService } from "../api/useDeleteService";
import { useResources } from "../../resources/api/useResources";
import { ServiceResourcesEditor } from "./ServiceResourcesEditor";

export function ServicesPage() {
  const { data: services, isLoading } = useServices();
  const { data: resources } = useResources();
  const createService = useCreateService();
  const deleteService = useDeleteService();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateServiceInput>({
    resolver: zodResolver(createServiceSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    await createService.mutateAsync(data);
    reset();
    setIsFormOpen(false);
  });

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display font-semibold text-2xl text-ink m-0">
            Hizmetler
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            Sunduğun hizmetler ve süreleri.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen((v) => !v)}
          className="bg-accent text-accent-ink rounded-lg px-4 py-2 text-sm font-medium"
        >
          + Yeni hizmet
        </button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={onSubmit}
          className="bg-page rounded-xl p-4 flex flex-col gap-3"
        >
          <div>
            <label className="text-xs text-neutral-500 block mb-1.5">
              Hizmet adı
            </label>
            <input
              placeholder="Örn. Saç kesimi"
              {...register("name")}
              className="w-full bg-paper border-0 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-neutral-500 block mb-1.5">
                Süre (dakika)
              </label>
              <input
                type="number"
                placeholder="45"
                {...register("durationMinutes", { valueAsNumber: true })}
                className="w-full bg-paper border-0 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
              {errors.durationMinutes && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.durationMinutes.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="text-xs text-neutral-500 block mb-1.5">
                Fiyat (₺, opsiyonel)
              </label>
              <input
                type="number"
                placeholder="500"
                {...register("price", { valueAsNumber: true })}
                className="w-full bg-paper border-0 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-sm text-neutral-500 px-3 py-2"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-ink text-paper rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60"
            >
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-page rounded-xl overflow-hidden">
        {isLoading && (
          <p className="p-4 text-sm text-neutral-500">Yükleniyor...</p>
        )}
        {services?.length === 0 && (
          <p className="p-4 text-sm text-neutral-500">
            Henüz hizmet eklenmemiş.
          </p>
        )}
        {services?.map((service, i) => (
          <div key={service.id} className={i % 2 === 0 ? "bg-paper" : ""}>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1">
                <p className="text-sm text-ink m-0">{service.name}</p>
                <p className="font-mono-time text-xs text-neutral-500 m-0">
                  {service.durationMinutes} dk
                  {service.price ? ` · ${service.price}₺` : ""}
                </p>
              </div>
              <button
                onClick={() =>
                  setExpandedId(expandedId === service.id ? null : service.id)
                }
                className="text-xs text-neutral-500 flex items-center gap-1"
              >
                Kaynaklar
                <IconChevronDown
                  size={14}
                  className={`transition-transform ${expandedId === service.id ? "rotate-180" : ""}`}
                />
              </button>
              <button
                onClick={() => deleteService.mutate(service.id)}
                className="text-neutral-400 hover:text-red-600"
                aria-label="Sil"
              >
                <IconTrash size={16} />
              </button>
            </div>

            {expandedId === service.id && (
              <ServiceResourcesEditor
                serviceId={service.id}
                allResources={resources ?? []}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
