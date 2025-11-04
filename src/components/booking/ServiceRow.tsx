import { ServiceItem } from "@/types/booking/ipAdmission";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

interface ServiceRowProps {
  service: ServiceItem;
  onAdd: (service: ServiceItem) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Procedure: "bg-amber-100 text-amber-700",
  Nursing: "bg-blue-100 text-blue-700",
  Pharmacy: "bg-green-100 text-green-700",
  Lab: "bg-purple-100 text-purple-700",
  Room: "bg-cyan-100 text-cyan-700",
};

export function ServiceRow({ service, onAdd }: ServiceRowProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 rounded-md transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-foreground truncate">{service.name}</p>
          <Badge variant="outline" className={CATEGORY_COLORS[service.category] || ""}>
            {service.category}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{service.code}</p>
      </div>
      
      <div className="flex items-center gap-4 ml-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">{formatCurrency(service.price)}</p>
          {service.taxPct > 0 && (
            <p className="text-xs text-muted-foreground">+{service.taxPct}% tax</p>
          )}
        </div>
        
        <Button
          size="sm"
          onClick={() => onAdd(service)}
          className="h-8 px-3"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
}
