import { useState } from "react";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { useSetAvailability } from "../api/useSetAvailability";
import type { AvailabilityRuleInput } from "@flexbook/shared";

const DAYS = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];

export function AvailabilityEditor({
  resourceId,
  initialRules,
}: {
  resourceId: string;
  initialRules: AvailabilityRuleInput[];
}) {
  const setAvailability = useSetAvailability(resourceId);
  const [rules, setRules] = useState<AvailabilityRuleInput[]>(initialRules);
  const [error, setError] = useState<string | null>(null);

  const rulesByDay = (day: number) => rules.filter((r) => r.dayOfWeek === day);

  const addRule = (day: number) => {
    setRules((prev) => [
      ...prev,
      { dayOfWeek: day, startTime: "09:00", endTime: "17:00" },
    ]);
  };

  const removeRule = (day: number, index: number) => {
    const dayRules = rulesByDay(day);
    const target = dayRules[index];
    setRules((prev) => prev.filter((r) => r !== target));
  };

  const updateRule = (
    day: number,
    index: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    const dayRules = rulesByDay(day);
    const target = dayRules[index];
    setRules((prev) =>
      prev.map((r) => (r === target ? { ...r, [field]: value } : r)),
    );
  };

  const handleSave = async () => {
    setError(null);
    try {
      await setAvailability.mutateAsync(rules);
    } catch {
      setError("Kaydedilemedi — aynı gün içinde çakışan saatler olabilir.");
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {DAYS.map((dayName, day) => {
        const dayRules = rulesByDay(day);
        return (
          <div
            key={day}
            className={`flex items-start gap-4 px-4 py-3.5 ${day > 0 ? "border-t border-border-subtle" : ""}`}
          >
            <span className="text-sm text-ink w-24 pt-1.5 shrink-0">
              {dayName}
            </span>

            <div className="flex-1 flex flex-col gap-2">
              {dayRules.length === 0 && (
                <span className="text-sm text-text-muted pt-1.5">Kapalı</span>
              )}
              {dayRules.map((rule, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="time"
                    value={rule.startTime}
                    onChange={(e) =>
                      updateRule(day, i, "startTime", e.target.value)
                    }
                    className="bg-page border-0 rounded-lg px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                  <span className="text-text-muted text-sm">—</span>
                  <input
                    type="time"
                    value={rule.endTime}
                    onChange={(e) =>
                      updateRule(day, i, "endTime", e.target.value)
                    }
                    className="bg-page border-0 rounded-lg px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                  <button
                    onClick={() => removeRule(day, i)}
                    className="text-text-muted hover:text-red-600"
                    aria-label="Aralığı sil"
                  >
                    <IconTrash size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addRule(day)}
                className="flex items-center gap-1 text-xs text-text-secondary hover:text-ink self-start mt-0.5"
              >
                <IconPlus size={12} /> Aralık ekle
              </button>
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between px-4 py-3.5 border-t border-border-subtle bg-surface-subtle">
        {error && <p className="text-xs text-red-600 m-0">{error}</p>}
        <button
          onClick={handleSave}
          disabled={setAvailability.isPending}
          className="ml-auto bg-ink text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {setAvailability.isPending ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
}
