import { useUpdateBookingStatus } from "../api/useUpdateBookingStatus";
import { STATUS_LABELS, NEXT_ACTIONS } from "../lib/transitions";
import { getAvatarColor, getInitials } from "../../../lib/avatar-color";
import type { Booking } from "../api/useBookings";

export function BookingDetailModal({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const updateStatus = useUpdateBookingStatus();
  const color = getAvatarColor(booking.customer.name);

  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const timeLabel = `${start.toLocaleDateString("tr-TR")} · ${start.toLocaleTimeString(
    "tr-TR",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  )}–${end.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl border border-border w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{ background: color.bg, color: color.text }}
          >
            {getInitials(booking.customer.name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink m-0">
              {booking.customer.name}
            </p>
            <p className="text-xs text-text-muted m-0">
              {booking.customer.phone}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-sm text-ink mb-4">
          <p className="m-0">
            <span className="text-text-muted">Hizmet:</span>{" "}
            {booking.service.name}
          </p>
          <p className="m-0">
            <span className="text-text-muted">Kaynak:</span>{" "}
            {booking.resource.name}
          </p>
          <p className="m-0 tabular-nums">
            <span className="text-text-muted">Zaman:</span> {timeLabel}
          </p>
          <p className="m-0">
            <span className="text-text-muted">Durum:</span>{" "}
            {STATUS_LABELS[booking.status]}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {NEXT_ACTIONS[booking.status].map((action) => (
            <button
              key={action.status}
              onClick={() => {
                updateStatus.mutate({ id: booking.id, status: action.status });
                onClose();
              }}
              className="bg-ink text-white rounded-lg px-3 py-2 text-sm font-medium"
            >
              {action.label}
            </button>
          ))}
          {NEXT_ACTIONS[booking.status].length === 0 && (
            <p className="text-xs text-text-muted text-center">
              Bu durumdan başka bir işlem yapılamaz.
            </p>
          )}
          <button onClick={onClose} className="text-sm text-text-muted py-1">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
