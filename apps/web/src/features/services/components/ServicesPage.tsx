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
import { getAvatarColor, getInitials } from "../../../lib/avatar-color";

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
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-xl text-ink m-0">Hizmetler</p>
          <p className="text-sm text-text-muted mt-1">
            Sunduğun hizmetler ve süreleri.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen((v) => !v)}
          className="bg-ink text-white rounded-lg px-4 py-2 text-sm font-semibold"
        >
          + Yeni hizmet
        </button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={onSubmit}
          className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-3"
        >
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">
              Hizmet adı
            </label>
            <input
              placeholder="Örn. Saç kesimi"
              {...register("name")}
              className="w-full bg-page border-0 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-text-secondary block mb-1.5">
                Süre (dakika)
              </label>
              <input
                type="number"
                placeholder="45"
                {...register("durationMinutes", { valueAsNumber: true })}
                className="w-full bg-page border-0 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              {errors.durationMinutes && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.durationMinutes.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-text-secondary block mb-1.5">
                Fiyat (₺, opsiyonel)
              </label>
              <input
                type="number"
                placeholder="500"
                {...register("price", { valueAsNumber: true })}
                className="w-full bg-page border-0 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-sm text-text-muted px-3 py-2"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-ink text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_140px_130px_90px_70px] px-4 py-2.5 bg-surface-subtle border-b border-border">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">
            Hizmet
          </span>
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">
            Süre / Fiyat
          </span>
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">
            Kaynaklar
          </span>
          <span />
          <span />
        </div>

        {isLoading && (
          <p className="p-4 text-sm text-text-muted">Yükleniyor...</p>
        )}
        {services?.length === 0 && (
          <p className="p-4 text-sm text-text-muted">
            Henüz hizmet eklenmemiş.
          </p>
        )}

        {services?.map((service, i) => {
          const assignedIds = service.resources.map((r) => r.resource.id);
          return (
            <div
              key={service.id}
              className={i > 0 ? "border-t border-border-subtle" : ""}
            >
              <div className="grid grid-cols-[1fr_140px_130px_90px_70px] items-center px-4 py-3">
                <span className="text-sm text-ink">{service.name}</span>
                <span className="text-xs text-text-secondary tabular-nums">
                  {service.durationMinutes} dk
                  {service.price ? ` · ${service.price}₺` : ""}
                </span>
                <div className="flex -space-x-1.5">
                  {service.resources.slice(0, 3).map(({ resource }) => {
                    const color = getAvatarColor(resource.name);
                    return (
                      <div
                        key={resource.id}
                        title={resource.name}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold border-2 border-surface"
                        style={{ background: color.bg, color: color.text }}
                      >
                        {getInitials(resource.name)}
                      </div>
                    );
                  })}
                  {service.resources.length === 0 && (
                    <span className="text-xs text-text-muted">Yok</span>
                  )}
                </div>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === service.id ? null : service.id)
                  }
                  className="text-xs text-text-muted flex items-center gap-1"
                >
                  Düzenle
                  <IconChevronDown
                    size={13}
                    className={`transition-transform ${expandedId === service.id ? "rotate-180" : ""}`}
                  />
                </button>
                <button
                  onClick={() => deleteService.mutate(service.id)}
                  className="text-text-muted hover:text-red-600 justify-self-end"
                  aria-label="Sil"
                >
                  <IconTrash size={15} />
                </button>
              </div>

              {expandedId === service.id && (
                <ServiceResourcesEditor
                  serviceId={service.id}
                  allResources={resources ?? []}
                  assignedResourceIds={assignedIds}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
