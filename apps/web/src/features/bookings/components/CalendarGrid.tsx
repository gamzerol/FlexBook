import {
  GRID_HEIGHT,
  ROW_HEIGHT,
  getHourLabels,
  timeToTop,
  durationToHeight,
  isSameDay,
  assignLanes,
} from "../lib/calendar-grid";
import { getAvatarColor } from "../../../lib/avatar-color";
import { STATUS_LABELS } from "../lib/transitions";
import type { Booking } from "../api/useBookings";
import type { Resource } from "../../resources/api/useResources";

const hourLabels = getHourLabels();

function BookingBlock({
  booking,
  top,
  height,
  left,
  width,
  onClick,
}: {
  booking: Booking;
  top: number;
  height: number;
  left: string;
  width: string;
  onClick: () => void;
}) {
  const color = getAvatarColor(booking.resource.name);
  const isCancelled = booking.status === "CANCELLED";

  return (
    <button
      onClick={onClick}
      style={{
        top,
        height,
        left,
        width,
        background: color.bg,
        borderColor: color.text,
      }}
      className={`absolute rounded-md border-l-[3px] px-2 py-1 text-left overflow-hidden ${
        isCancelled ? "opacity-40" : ""
      }`}
    >
      <p
        className="text-[11px] font-semibold m-0 truncate"
        style={{ color: color.text }}
      >
        {booking.customer.name}
      </p>
      <p className="text-[10px] m-0 truncate" style={{ color: color.text }}>
        {booking.service.name} · {STATUS_LABELS[booking.status]}
      </p>
    </button>
  );
}

// Gun gorunumu: kolonlar KAYNAK bazli. Ayni kaynagin cakisan iki
// rezervasyonu olamaz (backend'de engelli), bu yuzden lane hesabina
// gerek yok - direkt yerlestiriliyor.
export function DayCalendarGrid({
  date,
  resources,
  bookings,
  onSelectBooking,
}: {
  date: Date;
  resources: Resource[];
  bookings: Booking[];
  onSelectBooking: (b: Booking) => void;
}) {
  return (
    <div className="flex border border-border rounded-xl overflow-hidden bg-surface">
      <div className="w-14 shrink-0 border-r border-border-subtle">
        <div className="h-10 border-b border-border" />
        {hourLabels.map((label) => (
          <div
            key={label}
            style={{ height: ROW_HEIGHT * 2 }}
            className="text-[10px] text-text-muted pl-1 pt-0.5"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="flex-1 flex overflow-x-auto">
        {resources.map((resource) => {
          const dayBookings = bookings.filter(
            (b) =>
              b.resource.id === resource.id &&
              isSameDay(new Date(b.startTime), date),
          );
          return (
            <div
              key={resource.id}
              className="flex-1 min-w-[140px] border-r border-border-subtle last:border-r-0"
            >
              <div className="h-10 flex items-center justify-center border-b border-border">
                <span className="text-xs font-medium text-ink truncate px-1">
                  {resource.name}
                </span>
              </div>
              <div className="relative" style={{ height: GRID_HEIGHT }}>
                {Array.from({ length: GRID_HEIGHT / ROW_HEIGHT }).map(
                  (_, i) => (
                    <div
                      key={i}
                      style={{ top: i * ROW_HEIGHT, height: ROW_HEIGHT }}
                      className="absolute left-0 right-0 border-t border-border-subtle"
                    />
                  ),
                )}
                {dayBookings.map((b) => (
                  <BookingBlock
                    key={b.id}
                    booking={b}
                    top={timeToTop(new Date(b.startTime))}
                    height={durationToHeight(
                      new Date(b.startTime),
                      new Date(b.endTime),
                    )}
                    left="4px"
                    width="calc(100% - 8px)"
                    onClick={() => onSelectBooking(b)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Hafta gorunumu: kolonlar GUN bazli. Ayni gunde farkli kaynaklarin
// cakisan rezervasyonlari olabilir - assignLanes ile yan yana diziliyor.
export function WeekCalendarGrid({
  days,
  bookings,
  onSelectBooking,
}: {
  days: Date[];
  bookings: Booking[];
  onSelectBooking: (b: Booking) => void;
}) {
  return (
    <div className="flex border border-border rounded-xl overflow-hidden bg-surface">
      <div className="w-14 shrink-0 border-r border-border-subtle">
        <div className="h-12 border-b border-border" />
        {hourLabels.map((label) => (
          <div
            key={label}
            style={{ height: ROW_HEIGHT * 2 }}
            className="text-[10px] text-text-muted pl-1 pt-0.5"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="flex-1 flex overflow-x-auto">
        {days.map((day) => {
          const dayBookings = bookings.filter((b) =>
            isSameDay(new Date(b.startTime), day),
          );
          const laned = assignLanes(dayBookings);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className="flex-1 min-w-[120px] border-r border-border-subtle last:border-r-0"
            >
              <div
                className={`h-12 flex flex-col items-center justify-center border-b border-border ${isToday ? "bg-page" : ""}`}
              >
                <span className="text-[10px] text-text-muted">
                  {day.toLocaleDateString("tr-TR", { weekday: "short" })}
                </span>
                <span className="text-xs font-medium text-ink">
                  {day.getDate()}
                </span>
              </div>
              <div className="relative" style={{ height: GRID_HEIGHT }}>
                {Array.from({ length: GRID_HEIGHT / ROW_HEIGHT }).map(
                  (_, i) => (
                    <div
                      key={i}
                      style={{ top: i * ROW_HEIGHT, height: ROW_HEIGHT }}
                      className="absolute left-0 right-0 border-t border-border-subtle"
                    />
                  ),
                )}
                {laned.map(({ item, lane, totalLanes }) => (
                  <BookingBlock
                    key={item.id}
                    booking={item}
                    top={timeToTop(new Date(item.startTime))}
                    height={durationToHeight(
                      new Date(item.startTime),
                      new Date(item.endTime),
                    )}
                    left={`${(lane / totalLanes) * 100}%`}
                    width={`${100 / totalLanes}%`}
                    onClick={() => onSelectBooking(item)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
