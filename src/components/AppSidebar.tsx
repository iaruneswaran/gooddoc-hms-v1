import { MessageCircle, Mail, Calendar, Stethoscope, Activity, Users, UserCog, Network, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.svg";
import askGoodDocIcon from "@/assets/ask-gooddoc-icon.svg";

const menuItems = [
  { icon: MessageCircle, label: "Ask Good Doc", href: "/ask", highlight: true },
  { icon: Mail, label: "Inbox", href: "/inbox" },
  { icon: Calendar, label: "Appointments", href: "/" },
  { icon: Stethoscope, label: "Outpatient", href: "/outpatient" },
  { icon: Activity, label: "Diagnostics", href: "/diagnostics" },
  { icon: Users, label: "Patients", href: "/patients" },
  { icon: UserCog, label: "Doctors", href: "/doctors" },
  { icon: Network, label: "Networks", href: "/networks" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[196px] bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="GoodDoc" className="h-7" />
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
                item.highlight && "mb-4",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                !isActive && "hover:bg-sidebar-accent/50"
              )}
            >
              {item.highlight ? (
                <img src={askGoodDocIcon} alt="" className="w-5 h-5" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
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
