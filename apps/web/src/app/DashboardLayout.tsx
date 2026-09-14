import { NavLink, Outlet } from "react-router-dom";
import {
  IconCalendar,
  IconUsers,
  IconScissors,
  IconClock,
  IconAddressBook,
} from "@tabler/icons-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Rezervasyonlar", icon: IconCalendar, end: true },
  { to: "/dashboard/resources", label: "Kaynaklar", icon: IconUsers },
  { to: "/dashboard/services", label: "Hizmetler", icon: IconScissors },
  { to: "/dashboard/availability", label: "Müsaitlik", icon: IconClock },
  { to: "/dashboard/customers", label: "Müşteriler", icon: IconAddressBook },
];

export function DashboardLayout() {
  return (
    <div className="min-h-screen w-full flex bg-paper">
      <aside className="w-[220px] min-w-[200px] bg-ink p-6 flex flex-col gap-7">
        <div className="flex items-center gap-2">
          <div className="w-1 h-[18px] bg-accent rounded-sm" />
          <span className="font-display font-semibold text-lg text-paper">
            FlexBook
          </span>
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
                    ? "bg-accent/15 text-paper font-medium"
                    : "text-paper/65 hover:text-paper/90"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={16}
                    className={isActive ? "text-accent" : "text-paper/50"}
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
