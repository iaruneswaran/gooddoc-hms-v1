import { Bell, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type BreadcrumbItem = string | { label: string; onClick: () => void };

interface AppHeaderProps {
  breadcrumbs: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs }: AppHeaderProps) {
  return (
    <header className="relative h-16 border-b border-border bg-card flex items-center px-4">
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

      {/* Icons - Right */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
        </button>
        <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
            1
          </Badge>
        </button>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <User className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </header>
  );
}
