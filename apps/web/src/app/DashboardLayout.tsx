import { NavLink, Outlet } from "react-router-dom";
import {
  IconCalendar,
  IconLayoutGrid,
  IconUsers,
  IconScissors,
  IconClock,
  IconAddressBook,
} from "@tabler/icons-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Rezervasyonlar", icon: IconCalendar, end: true },
  { to: "/dashboard/calendar", label: "Takvim", icon: IconLayoutGrid },
  { to: "/dashboard/resources", label: "Kaynaklar", icon: IconUsers },
  { to: "/dashboard/services", label: "Hizmetler", icon: IconScissors },
  { to: "/dashboard/availability", label: "Müsaitlik", icon: IconClock },
  { to: "/dashboard/customers", label: "Müşteriler", icon: IconAddressBook },
];

export function DashboardLayout() {
  return (
    <div className="min-h-screen w-full flex bg-page">
      <aside className="w-[220px] min-w-[200px] bg-surface border-r border-border p-5 flex flex-col gap-7">
        <div className="flex items-center gap-2 px-1">
          <div className="w-[20px] h-[20px] rounded-md bg-accent flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-sm bg-white" />
          </div>
          <span className="font-bold text-[15px] text-ink">FlexBook</span>
        </div>

        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm ${
                  isActive
                    ? "bg-page text-ink font-medium"
                    : "text-text-muted hover:bg-page/60"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={16}
                    className={isActive ? "text-ink" : "text-text-muted"}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0 p-8">
        <Outlet />
      </main>
    </div>
  );
}
