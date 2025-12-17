import { 
  LayoutDashboard, 
  CalendarCheck, 
  Calendar, 
  Stethoscope, 
  Activity, 
  Users, 
  BriefcaseMedical, 
  Settings, 
  LogOut, 
  Tag, 
  Pill, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.svg";
import logoIcon from "@/assets/logo-icon.svg";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/overview" },
  { icon: CalendarCheck, label: "Schedule Request", href: "/inbox", badge: 12 },
  { icon: Calendar, label: "Appointments", href: "/" },
  { icon: Stethoscope, label: "Outpatient", href: "/appointments/outpatient" },
  { icon: Activity, label: "Diagnostics", href: "/diagnostics" },
  { icon: BriefcaseMedical, label: "Doctors", href: "/doctors" },
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
        "fixed left-0 top-0 h-screen bg-gradient-to-b from-sidebar to-[hsl(222,47%,9%)] text-sidebar-foreground flex flex-col transition-all duration-300 z-50 border-r border-sidebar-border/50",
        isCollapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo section with toggle */}
      <div className={cn(
        "h-16 flex items-center border-b border-sidebar-border/50",
        isCollapsed ? "justify-center px-3" : "justify-between px-4"
      )}>
        <Link to="/" className="flex items-center gap-2">
          {isCollapsed ? (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          ) : (
            <>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">GoodDoc</span>
            </>
          )}
        </Link>
        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent transition-all duration-200 group"
            aria-label="Collapse menu"
          >
            <ChevronLeft className="w-4 h-4 text-sidebar-foreground group-hover:text-white transition-colors" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <div className="px-3 py-3">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center py-2 rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-all duration-200"
            aria-label="Expand menu"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className={cn("flex-1 py-4 overflow-y-auto", isCollapsed ? "px-3" : "px-3")}>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || 
                            (item.href === "/diagnostics" && location.pathname.startsWith("/diagnostics"));
            
            const linkContent = (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isCollapsed ? "justify-center p-3" : "px-3 py-2.5",
                  isActive 
                    ? "bg-gradient-to-r from-primary/20 to-primary/10 text-white shadow-lg shadow-primary/10" 
                    : "text-sidebar-foreground hover:text-white hover:bg-sidebar-accent/40"
                )}
              >
                {/* Active indicator bar */}
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
                
                {/* Icon container */}
                <div className={cn(
                  "flex items-center justify-center rounded-lg transition-all duration-200",
                  isCollapsed ? "w-10 h-10" : "w-8 h-8",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/30" 
                    : "bg-sidebar-accent/30 text-sidebar-foreground group-hover:bg-sidebar-accent/50 group-hover:text-white"
                )}>
                  <Icon className={cn("shrink-0", isCollapsed ? "w-5 h-5" : "w-4 h-4")} />
                </div>
                
                {!isCollapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-primary text-white text-xs font-semibold shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                
                {/* Badge for collapsed state */}
                {isCollapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold shadow-md">
                    {item.badge}
                  </span>
                )}
              </Link>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="relative mb-1">
                      {linkContent}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="right" 
                    sideOffset={12}
                    className="bg-sidebar-accent border-sidebar-border text-white font-medium"
                  >
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href} className="mb-1">{linkContent}</div>;
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className={cn(
        "border-t border-sidebar-border/50",
        isCollapsed ? "p-3" : "p-3"
      )}>
        {isCollapsed ? (
          <div className="space-y-1">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to="/settings"
                  className="flex items-center justify-center p-3 rounded-xl text-sidebar-foreground hover:text-white hover:bg-sidebar-accent/40 transition-all duration-200"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-colors">
                    <Settings className="w-5 h-5" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12} className="bg-sidebar-accent border-sidebar-border text-white font-medium">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button className="w-full flex items-center justify-center p-3 rounded-xl text-sidebar-foreground hover:text-white hover:bg-sidebar-accent/40 transition-all duration-200">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12} className="bg-sidebar-accent border-sidebar-border text-white font-medium">
                <p>Sign Out</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <div className="space-y-1">
            <Link
              to="/settings"
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground hover:text-white hover:bg-sidebar-accent/40 transition-all duration-200"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-sidebar-accent/30 group-hover:bg-sidebar-accent/50 transition-colors">
                <Settings className="w-4 h-4" />
              </div>
              <span>Settings</span>
            </Link>
            <button className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground hover:text-white hover:bg-sidebar-accent/40 transition-all duration-200">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-sidebar-accent/30 group-hover:bg-sidebar-accent/50 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}