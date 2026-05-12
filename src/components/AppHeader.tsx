import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Search, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ConnectionStatusIndicator } from "@/components/realtime/ConnectionStatusIndicator";
import { getCurrentUser, logout } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type BreadcrumbItem = string | { label: string; onClick: () => void };

interface AppHeaderProps {
  breadcrumbs: BreadcrumbItem[];
}

// Mock notifications data with route mapping
const notifications = [
  {
    id: 1,
    title: "New appointment request",
    description: "Dr. Sharma has a new appointment request",
    time: "5 min ago",
    unread: true,
    route: "/schedule/today?date=today",
  },
  {
    id: 2,
    title: "Lab results ready",
    description: "Patient Rajesh Kumar's lab results are ready",
    time: "1 hour ago",
    unread: false,
    route: "/lab/pending",
  },
  {
    id: 3,
    title: "Discharge completed",
    description: "Patient Priya Patel has been discharged",
    time: "2 hours ago",
    unread: false,
    route: "/patients/discharged",
  },
];

export function AppHeader({ breadcrumbs }: AppHeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const user = getCurrentUser();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/patients?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/auth");
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="relative h-14 border-b border-border bg-card flex items-center px-4">
      {/* Breadcrumbs - Left */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => {
          const isClickable = typeof crumb === "object";
          const label = isClickable ? crumb.label : crumb;
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              {isClickable && !isLast ? (
                <button
                  onClick={crumb.onClick}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  {label}
                </button>
              ) : (
                <span className={isLast ? "text-foreground font-medium" : ""}>
                  {label}
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Global Search - Center - High Priority */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[500px]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <Input
            placeholder="Search patients by name, ID, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="pl-12 h-10 bg-background border-2 border-primary/30 rounded-full shadow-sm text-base placeholder:text-muted-foreground/70 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary/50"
          />
        </div>
      </div>

      {/* Icons - Right */}
      <div className="flex items-center gap-3">
        <ConnectionStatusIndicator size="sm" />
        
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-foreground" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
                  {unreadCount}
                </Badge>
              )}
            </button>
          </DropdownMenuTrigger>
<DropdownMenuContent align="end" className="w-80 max-h-80 overflow-y-auto bg-popover">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              <>
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                    onClick={() => navigate(notification.route)}
                  >
                    <div className="flex items-start gap-2 w-full">
                      {notification.unread && (
                        <span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      )}
                      <div className={notification.unread ? "" : "ml-4"}>
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-secondary rounded-lg transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {user?.fullName?.split(' ').map(n => n[0]).join('') || 'GD'}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{user?.fullName || user?.username}</p>
                  <Badge variant="outline" className="text-[10px] h-4 px-1 font-normal border-primary/20 bg-primary/5 text-primary">
                    {user?.role === 'DENTAL' ? 'Dental' : 'Front Desk'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{user?.email || 'admin@gooddoc.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate("/settings")}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
