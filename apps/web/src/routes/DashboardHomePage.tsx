import { useCurrentBusiness } from "../features/business/api/useCurrentBusiness";

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
  confirmed: { bg: "bg-[#E4EDE6]", text: "text-[#3F6B4F]", label: "Onaylandı" },
  pending: { bg: "bg-[#F3E4CC]", text: "text-[#8A5A22]", label: "Bekliyor" },
};

export function DashboardHomePage() {
  const { data: business } = useCurrentBusiness();

  const initials = business?.name
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="font-display font-semibold text-2xl text-ink m-0">
          {business?.name ?? "Yükleniyor..."}
        </p>
        {initials && (
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
            <span className="text-xs font-semibold text-accent-ink">
              {initials}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-page rounded-[10px] p-4">
          <p className="text-xs text-neutral-500 mb-1.5">Bugünkü rezervasyon</p>
          <p className="font-mono-time text-2xl text-ink m-0">08</p>
        </div>
        <div className="bg-page rounded-[10px] p-4">
          <p className="text-xs text-neutral-500 mb-1.5">Doluluk oranı</p>
          <p className="font-mono-time text-2xl text-ink m-0">%72</p>
        </div>
        <div className="bg-page rounded-[10px] p-4">
          <p className="text-xs text-neutral-500 mb-1.5">Bekleyen onay</p>
          <p className="font-mono-time text-2xl text-ink m-0">02</p>
        </div>
      </div>

      <div className="bg-page rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3.5">
          <span className="text-sm font-semibold text-ink">Bugün</span>
          <button className="bg-accent text-accent-ink rounded-lg px-3.5 py-1.5 text-xs font-medium">
            + Yeni rezervasyon
          </button>
        </div>

        {PLACEHOLDER_BOOKINGS.map((booking, i) => {
          const style = STATUS_STYLES[booking.status];
          return (
            <div
              key={i}
              className={`flex items-center gap-3.5 px-4 py-3 ${i % 2 === 0 ? "bg-paper" : ""}`}
            >
              <span className="font-mono-time text-xs text-neutral-500 w-11">
                {booking.time}
              </span>
              <div className="flex-1">
                <p className="text-sm text-ink m-0">{booking.customer}</p>
                <p className="text-xs text-neutral-500 m-0">
                  {booking.service}
                </p>
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
