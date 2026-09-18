import { useState } from "react";
import { useCurrentBusiness } from "../features/business/api/useCurrentBusiness";
import { useBookings } from "../features/bookings/api/useBookings";
import { useUpdateBookingStatus } from "../features/bookings/api/useUpdateBookingStatus";
import { CreateBookingModal } from "../features/bookings/components/CreateBookingModal";
import { getAvatarColor, getInitials } from "../lib/avatar-color";
import type { BookingStatus } from "../features/bookings/api/useBookings";

const STATUS_STYLES: Record<
  BookingStatus,
  { bg: string; text: string; label: string }
> = {
  PENDING: { bg: "bg-[#FDEEDC]", text: "text-[#92600B]", label: "Bekliyor" },
  CONFIRMED: { bg: "bg-[#DCF3E3]", text: "text-[#1F7A44]", label: "Onaylandı" },
  CANCELLED: {
    bg: "bg-[#F4F4F5]",
    text: "text-text-muted",
    label: "İptal edildi",
  },
  COMPLETED: {
    bg: "bg-[#E7E9FC]",
    text: "text-[#3A3FA3]",
    label: "Tamamlandı",
  },
  NO_SHOW: { bg: "bg-[#FDE4E9]", text: "text-[#B23A55]", label: "Gelmedi" },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardHomePage() {
  const { data: business } = useCurrentBusiness();
  const { data: bookings, isLoading } = useBookings();
  const updateStatus = useUpdateBookingStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayBookings = (bookings ?? []).filter((b) => {
    const d = new Date(b.startTime);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  const pendingCount = (bookings ?? []).filter(
    (b) => b.status === "PENDING",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-2xl text-ink m-0">
          {business?.name ?? "Yükleniyor..."}
        </p>
        {business && (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: getAvatarColor(business.name).bg }}
          >
            <span
              className="text-xs font-semibold"
              style={{ color: getAvatarColor(business.name).text }}
            >
              {getInitials(business.name)}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-text-muted mb-1.5">Bugünkü rezervasyon</p>
          <p className="text-2xl text-ink m-0 tabular-nums">
            {todayBookings.length}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-text-muted mb-1.5">Toplam rezervasyon</p>
          <p className="text-2xl text-ink m-0 tabular-nums">
            {bookings?.length ?? 0}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-text-muted mb-1.5">Bekleyen onay</p>
          <p className="text-2xl text-ink m-0 tabular-nums">{pendingCount}</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border-subtle">
          <span className="text-sm font-semibold text-ink">Bugün</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-ink text-white rounded-lg px-3.5 py-1.5 text-xs font-semibold"
          >
            + Yeni rezervasyon
          </button>
        </div>

        {isLoading && (
          <p className="p-4 text-sm text-text-muted">Yükleniyor...</p>
        )}
        {!isLoading && todayBookings.length === 0 && (
          <p className="p-4 text-sm text-text-muted">
            Bugün için rezervasyon yok.
          </p>
        )}

        {todayBookings.map((booking, i) => {
          const style = STATUS_STYLES[booking.status];
          const color = getAvatarColor(booking.customer.name);
          return (
            <div
              key={booking.id}
              className={`flex items-center gap-3.5 px-4 py-3 ${i > 0 ? "border-t border-border-subtle" : ""}`}
            >
              <span className="text-xs text-text-muted w-11 tabular-nums">
                {formatTime(booking.startTime)}
              </span>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold"
                style={{ background: color.bg, color: color.text }}
              >
                {getInitials(booking.customer.name)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-ink m-0">{booking.customer.name}</p>
                <p className="text-xs text-text-muted m-0">
                  {booking.service.name} · {booking.resource.name}
                </p>
              </div>
              <span
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${style.bg} ${style.text}`}
              >
                {style.label}
              </span>

              {/* Bolum 6'daki durum makinesine uygun hizli aksiyonlar */}
              {booking.status === "PENDING" && (
                <button
                  onClick={() =>
                    updateStatus.mutate({ id: booking.id, status: "CONFIRMED" })
                  }
                  className="text-xs text-ink font-medium hover:underline"
                >
                  Onayla
                </button>
              )}
              {(booking.status === "PENDING" ||
                booking.status === "CONFIRMED") && (
                <button
                  onClick={() =>
                    updateStatus.mutate({ id: booking.id, status: "CANCELLED" })
                  }
                  className="text-xs text-text-muted hover:text-red-600"
                >
                  İptal et
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <CreateBookingModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
