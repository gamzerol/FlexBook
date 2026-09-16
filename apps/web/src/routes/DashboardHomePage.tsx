import { useCurrentBusiness } from "../features/business/api/useCurrentBusiness";
import { getAvatarColor, getInitials } from "../lib/avatar-color";

const PLACEHOLDER_BOOKINGS = [
  {
    time: "10:00",
    customer: "Ayşe Yılmaz",
    service: "Saç kesimi",
    status: "confirmed" as const,
  },
  {
    time: "10:30",
    customer: "Mehmet Kaya",
    service: "Sakal tıraşı",
    status: "pending" as const,
  },
  {
    time: "11:00",
    customer: "Zeynep Demir",
    service: "Boya",
    status: "confirmed" as const,
  },
];

const STATUS_STYLES = {
  confirmed: { bg: "bg-[#DCF3E3]", text: "text-[#1F7A44]", label: "Onaylandı" },
  pending: { bg: "bg-[#FDEEDC]", text: "text-[#92600B]", label: "Bekliyor" },
};

export function DashboardHomePage() {
  const { data: business } = useCurrentBusiness();

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
          <p className="text-2xl text-ink m-0 tabular-nums">08</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-text-muted mb-1.5">Doluluk oranı</p>
          <p className="text-2xl text-ink m-0 tabular-nums">%72</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-text-muted mb-1.5">Bekleyen onay</p>
          <p className="text-2xl text-ink m-0 tabular-nums">02</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border-subtle">
          <span className="text-sm font-semibold text-ink">Bugün</span>
          <button className="bg-ink text-white rounded-lg px-3.5 py-1.5 text-xs font-semibold">
            + Yeni rezervasyon
          </button>
        </div>

        {PLACEHOLDER_BOOKINGS.map((booking, i) => {
          const style = STATUS_STYLES[booking.status];
          const color = getAvatarColor(booking.customer);
          return (
            <div
              key={i}
              className={`flex items-center gap-3.5 px-4 py-3 ${i > 0 ? "border-t border-border-subtle" : ""}`}
            >
              <span className="text-xs text-text-muted w-11 tabular-nums">
                {booking.time}
              </span>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold"
                style={{ background: color.bg, color: color.text }}
              >
                {getInitials(booking.customer)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-ink m-0">{booking.customer}</p>
                <p className="text-xs text-text-muted m-0">{booking.service}</p>
              </div>
              <span
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${style.bg} ${style.text}`}
              >
                {style.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
