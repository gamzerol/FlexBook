import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  createResourceSchema,
  type CreateResourceInput,
} from "@flexbook/shared";

type CreateResourceFormInput = z.input<typeof createResourceSchema>;
import { IconTrash, IconUser, IconBox } from "@tabler/icons-react";
import { useResources } from "../api/useResources";
import { useCreateResource } from "../api/useCreateResource";
import { useDeleteResource } from "../api/useDeleteResource";

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
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display font-semibold text-2xl text-ink m-0">
            Kaynaklar
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            Rezervasyon alınabilen kişi veya varlıklar.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen((v) => !v)}
          className="bg-accent text-accent-ink rounded-lg px-4 py-2 text-sm font-medium"
        >
          + Yeni kaynak
        </button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={onSubmit}
          className="bg-page rounded-xl p-4 flex flex-col gap-3"
        >
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-neutral-500 block mb-1.5">
                İsim
              </label>
              <input
                placeholder="Örn. Ayşe Yılmaz"
                {...register("name")}
                className="w-full bg-paper border-0 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="w-40">
              <label className="text-xs text-neutral-500 block mb-1.5">
                Tür
              </label>
              <select
                {...register("type")}
                className="w-full bg-paper border-0 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
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
        {resources?.length === 0 && (
          <p className="p-4 text-sm text-neutral-500">
            Henüz kaynak eklenmemiş.
          </p>
        )}
        {resources?.map((resource, i) => (
          <div
            key={resource.id}
            className={`flex items-center gap-3 px-4 py-3 ${i % 2 === 0 ? "bg-paper" : ""}`}
          >
            {resource.type === "PERSON" ? (
              <IconUser size={16} className="text-neutral-400" />
            ) : (
              <IconBox size={16} className="text-neutral-400" />
            )}
            <span className="flex-1 text-sm text-ink">{resource.name}</span>
            <button
              onClick={() => deleteResource.mutate(resource.id)}
              className="text-neutral-400 hover:text-red-600"
              aria-label="Sil"
            >
              <IconTrash size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
