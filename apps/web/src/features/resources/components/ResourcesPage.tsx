import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createResourceSchema,
  type CreateResourceInput,
} from "@flexbook/shared";

type CreateResourceFormInput = z.input<typeof createResourceSchema>;
import { IconTrash } from "@tabler/icons-react";
import { useResources } from "../api/useResources";
import { useCreateResource } from "../api/useCreateResource";
import { useDeleteResource } from "../api/useDeleteResource";
import { getAvatarColor, getInitials } from "../../../lib/avatar-color";

export function ResourcesPage() {
  const { data: resources, isLoading } = useResources();
  const createResource = useCreateResource();
  const deleteResource = useDeleteResource();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateResourceFormInput, unknown, CreateResourceInput>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: { type: "PERSON" },
  });

  const onSubmit = handleSubmit(async (data) => {
    await createResource.mutateAsync(data);
    reset();
    setIsFormOpen(false);
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-xl text-ink m-0">Kaynaklar</p>
          <p className="text-sm text-text-muted mt-1">
            Rezervasyon alınabilen kişi veya varlıklar.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen((v) => !v)}
          className="bg-ink text-white rounded-lg px-4 py-2 text-sm font-semibold"
        >
          + Yeni kaynak
        </button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={onSubmit}
          className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-3"
        >
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-text-secondary block mb-1.5">
                İsim
              </label>
              <input
                placeholder="Örn. Ayşe Yılmaz"
                {...register("name")}
                className="w-full bg-page border-0 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="w-40">
              <label className="text-xs font-medium text-text-secondary block mb-1.5">
                Tür
              </label>
              <select
                {...register("type")}
                className="w-full bg-page border-0 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                <option value="PERSON">Kişi</option>
                <option value="ASSET">Varlık (oda vb.)</option>
              </select>
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
        <div className="grid grid-cols-[1fr_120px_100px_44px] px-4 py-2.5 bg-surface-subtle border-b border-border">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">
            İsim
          </span>
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">
            Tür
          </span>
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">
            Durum
          </span>
          <span />
        </div>

        {isLoading && (
          <p className="p-4 text-sm text-text-muted">Yükleniyor...</p>
        )}
        {resources?.length === 0 && (
          <p className="p-4 text-sm text-text-muted">
            Henüz kaynak eklenmemiş.
          </p>
        )}

        {resources?.map((resource, i) => {
          const color = getAvatarColor(resource.name);
          return (
            <div
              key={resource.id}
              className={`grid grid-cols-[1fr_120px_100px_44px] items-center px-4 py-3 ${
                i > 0 ? "border-t border-border-subtle" : ""
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold"
                  style={{ background: color.bg, color: color.text }}
                >
                  {getInitials(resource.name)}
                </div>
                <span className="text-sm text-ink">{resource.name}</span>
              </div>
              <span className="text-xs text-text-secondary">
                {resource.type === "PERSON" ? "Kişi" : "Varlık"}
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#DCF3E3] text-[#1F7A44] font-medium w-fit">
                Aktif
              </span>
              <button
                onClick={() => deleteResource.mutate(resource.id)}
                className="text-text-muted hover:text-red-600"
                aria-label="Sil"
              >
                <IconTrash size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
