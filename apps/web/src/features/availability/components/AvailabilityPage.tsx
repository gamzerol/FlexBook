import { useState } from "react";
import { useResources } from "../../resources/api/useResources";
import { useAvailability } from "../api/useAvailability";
import { AvailabilityEditor } from "./AvailabilityEditor";

export function AvailabilityPage() {
  const { data: resources } = useResources();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const effectiveId = selectedId ?? resources?.[0]?.id ?? null;

  const { data: availabilityData, isLoading } = useAvailability(effectiveId);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-semibold text-xl text-ink m-0">Müsaitlik</p>
        <p className="text-sm text-text-muted mt-1">
          Kaynakların haftalık çalışma saatleri.
        </p>
      </div>

      {!resources || resources.length === 0 ? (
        <p className="text-sm text-text-muted">
          Müsaitlik tanımlamak için önce Kaynaklar sekmesinden bir kaynak ekle.
        </p>
      ) : (
        <>
          <select
            value={effectiveId ?? ""}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-64 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {effectiveId && isLoading && (
            <p className="text-sm text-text-muted">Yükleniyor...</p>
          )}

          {effectiveId && !isLoading && (
            <AvailabilityEditor
              key={effectiveId}
              resourceId={effectiveId}
              initialRules={(availabilityData ?? []).map(
                ({ dayOfWeek, startTime, endTime }) => ({
                  dayOfWeek,
                  startTime,
                  endTime,
                }),
              )}
            />
          )}
        </>
      )}
    </div>
  );
}
