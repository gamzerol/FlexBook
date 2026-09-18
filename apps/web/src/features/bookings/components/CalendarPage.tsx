import { useState, useMemo } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useBookings } from "../api/useBookings";
import { useResources } from "../../resources/api/useResources";
import { DayCalendarGrid, WeekCalendarGrid } from "./CalendarGrid";
import { BookingDetailModal } from "./BookingDetailModal";
import { CreateBookingModal } from "./CreateBookingModal";
import { getWeekDates } from "../lib/calendar-grid";
import type { Booking } from "../api/useBookings";

export function CalendarPage() {
  const [view, setView] = useState<"day" | "week">("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: resources } = useResources();

  const { from, to, weekDays } = useMemo(() => {
    if (view === "day") {
      const start = new Date(currentDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      return { from: start, to: end, weekDays: [start] };
    }
    const days = getWeekDates(currentDate);
    const end = new Date(days[6]);
    end.setDate(end.getDate() + 1);
    return { from: days[0], to: end, weekDays: days };
  }, [view, currentDate]);

  const { data: bookings } = useBookings({ from: from.toISOString(), to: to.toISOString() });

  const goPrev = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - (view === "day" ? 1 : 7));
    setCurrentDate(d);
  };
  const goNext = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + (view === "day" ? 1 : 7));
    setCurrentDate(d);
  };

  const rangeLabel =
    view === "day"
      ? currentDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
      : `${weekDays[0].toLocaleDateString("tr-TR", { day: "numeric", month: "short" })} – ${weekDays[6].toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-semibold text-2xl text-ink m-0">Takvim</p>
          <p className="text-sm text-text-muted mt-1">{rangeLabel}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-page rounded-lg p-0.5">
            <button
              onClick={() => setView("day")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium ${view === "day" ? "bg-surface text-ink shadow-sm" : "text-text-muted"}`}
            >
              Gün
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium ${view === "week" ? "bg-surface text-ink shadow-sm" : "text-text-muted"}`}
            >
              Hafta
            </button>
          </div>

          <button onClick={goPrev} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-secondary">
            <IconChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-ink"
          >
            Bugün
          </button>
          <button onClick={goNext} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-secondary">
            <IconChevronRight size={16} />
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-ink text-white rounded-lg px-4 py-2 text-sm font-semibold ml-1"
          >
            + Yeni rezervasyon
          </button>
        </div>
      </div>

      {view === "day" ? (
        <DayCalendarGrid
          date={currentDate}
          resources={resources ?? []}
          bookings={bookings ?? []}
          onSelectBooking={setSelectedBooking}
        />
      ) : (
        <WeekCalendarGrid days={weekDays} bookings={bookings ?? []} onSelectBooking={setSelectedBooking} />
      )}

      {selectedBooking && (
        <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
      {isCreateOpen && <CreateBookingModal onClose={() => setIsCreateOpen(false)} />}
    </div>
  );
}
