import { LayoutDashboard, CalendarCheck, Calendar, Stethoscope, Activity, Users, UserCog, Settings, LogOut, Tag, Pill, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.svg";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/overview" },
  { icon: CalendarCheck, label: "Schedule Request", href: "/inbox", badge: 12 },
  { icon: Calendar, label: "Appointments", href: "/" },
  { icon: Stethoscope, label: "Outpatient", href: "/appointments/outpatient" },
  { icon: Activity, label: "Diagnostics", href: "/diagnostics" },
  { icon: UserCog, label: "Doctors", href: "/doctors" },
  { icon: Users, label: "Patients", href: "/patients" },
  { icon: Tag, label: "Pricing Catalog", href: "/pricing-catalog" },
  { icon: Pill, label: "Pharmacy", href: "/pharmacy" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
];

export function AppSidebar() {
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebarContext();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 z-50",
        isCollapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Logo section */}
      <div className={cn("p-4 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
        <Link to="/" className="flex items-center">
          {isCollapsed ? (
            <img src={logo} alt="GoodDoc" className="h-6 w-6 object-contain" />
          ) : (
            <img src={logo} alt="GoodDoc" className="h-7" />
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
                          (item.href === "/diagnostics" && location.pathname.startsWith("/diagnostics"));
          
          const linkContent = (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                !isActive && "hover:bg-sidebar-accent/50",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="min-w-5 h-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {isCollapsed && item.badge && (
                <span className="absolute top-0 right-0 min-w-4 h-4 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-medium translate-x-1 -translate-y-1">
                  {item.badge}
                </span>
              )}
            </Link>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <div className="relative">
                    {linkContent}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-2 border-t border-sidebar-border">
        {isCollapsed ? (
          <>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to="/settings"
                  className="flex items-center justify-center px-2 py-2.5 rounded-lg text-sm mb-1 hover:bg-sidebar-accent/50 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button className="w-full flex items-center justify-center px-2 py-2.5 rounded-lg text-sm hover:bg-sidebar-accent/50 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                <p>Sign Out</p>
              </TooltipContent>
            </Tooltip>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Collapse toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-sidebar border border-sidebar-border rounded-full flex items-center justify-center hover:bg-sidebar-accent transition-colors shadow-sm"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </aside>
  );
}
