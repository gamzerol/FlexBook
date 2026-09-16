import { useState } from "react";
import { useSetServiceResources } from "../api/useSetServiceResources";
import type { Resource } from "../../resources/api/useResources";

export function ServiceResourcesEditor({
  serviceId,
  allResources,
}: {
  serviceId: string;
  allResources: Resource[];
}) {
  const setResources = useSetServiceResources();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="px-4 pb-4 pt-1 flex flex-col gap-2">
      {allResources.length === 0 && (
        <p className="text-xs text-neutral-500">
          Önce Kaynaklar sekmesinden bir kaynak ekle.
        </p>
      )}
      {allResources.map((resource) => (
        <label
          key={resource.id}
          className="flex items-center gap-2 text-sm text-ink"
        >
          <input
            type="checkbox"
            checked={selected.includes(resource.id)}
            onChange={() => toggle(resource.id)}
            className="accent-accent"
          />
          {resource.name}
        </label>
      ))}
      {allResources.length > 0 && (
        <button
          onClick={() =>
            setResources.mutate({ serviceId, resourceIds: selected })
          }
          disabled={setResources.isPending}
          className="self-start mt-1 bg-ink text-paper rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-60"
        >
          {setResources.isPending ? "Kaydediliyor..." : "Eşleştirmeyi kaydet"}
        </button>
      )}
    </div>
  );
}
