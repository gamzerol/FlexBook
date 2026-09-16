import { useState } from "react";
import { useSetServiceResources } from "../api/useSetServiceResources";
import type { Resource } from "../../resources/api/useResources";

export function ServiceResourcesEditor({
  serviceId,
  allResources,
  assignedResourceIds,
}: {
  serviceId: string;
  allResources: Resource[];
  assignedResourceIds: string[];
}) {
  const setResources = useSetServiceResources();
  // ARTIK backend'den gelen gercek atamayla basliyoruz - onceki hatanin duzeltmesi.
  const [selected, setSelected] = useState<string[]>(assignedResourceIds);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="px-4 pb-4 pt-1 flex flex-col gap-2 bg-surface-subtle">
      {allResources.length === 0 && (
        <p className="text-xs text-text-muted">Önce Kaynaklar sekmesinden bir kaynak ekle.</p>
      )}
      {allResources.map((resource) => (
        <label key={resource.id} className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={selected.includes(resource.id)}
            onChange={() => toggle(resource.id)}
            className="accent-ink"
          />
          {resource.name}
        </label>
      ))}
      {allResources.length > 0 && (
        <button
          onClick={() => setResources.mutate({ serviceId, resourceIds: selected })}
          disabled={setResources.isPending}
          className="self-start mt-1 bg-ink text-white rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-60"
        >
          {setResources.isPending ? "Kaydediliyor..." : "Eşleştirmeyi kaydet"}
        </button>
      )}
    </div>
  );
}
