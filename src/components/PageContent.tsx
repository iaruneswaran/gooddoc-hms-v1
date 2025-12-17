import { ReactNode } from "react";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

export function PageContent({ children, className }: PageContentProps) {
  const { isCollapsed } = useSidebarContext();

  return (
    <div 
      className={cn(
        "flex-1 transition-all duration-300",
        isCollapsed ? "ml-[68px]" : "ml-[240px]",
        className
      )}
    >
      {children}
    </div>
  );
}
