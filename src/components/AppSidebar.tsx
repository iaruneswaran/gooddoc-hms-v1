import { MessageCircle, Mail, Calendar, Stethoscope, Activity, Pill, Users, Network, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: MessageCircle, label: "Ask Good Doc", href: "/ask", highlight: true },
  { icon: Mail, label: "Inbox", href: "/inbox" },
  { icon: Calendar, label: "Appointments", href: "/" },
  { icon: Stethoscope, label: "Outpatient", href: "/outpatient" },
  { icon: Activity, label: "Diagnostics", href: "/diagnostics" },
  { icon: Pill, label: "Pharmacy", href: "/pharmacy" },
  { icon: Users, label: "Patients", href: "/patients" },
  { icon: Network, label: "Networks", href: "/networks" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[196px] bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-semibold text-white">g</span>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-xl font-semibold text-white">d doc</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors",
                item.highlight && "bg-primary text-primary-foreground mb-4 hover:bg-primary/90",
                !item.highlight && isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                !item.highlight && !isActive && "hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 hover:bg-sidebar-accent/50 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-sidebar-accent/50 transition-colors">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
