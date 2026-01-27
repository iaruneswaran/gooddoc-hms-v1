import { ServiceItem, CartItem } from "@/types/booking/ipAdmission";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "./QuantityStepper";
import { CheckCircle2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCatalogRowProps {
  service: ServiceItem;
  cartItem: CartItem | undefined;
  onAdd: (service: ServiceItem) => void;
  onUpdateQty: (itemId: string, qty: number) => void;
  onRemove: (itemId: string) => void;
  formatPrice: (amount: number) => string;
}

export function ServiceCatalogRow({
  service,
  cartItem,
  onAdd,
  onUpdateQty,
  onRemove,
  formatPrice,
}: ServiceCatalogRowProps) {
  const inCart = !!cartItem;

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 py-3 transition-all duration-150",
        inCart 
          ? "bg-primary/5 border-l-2 border-l-primary" 
          : "hover:bg-muted/50 border-l-2 border-l-transparent"
      )}
    >
      {/* Service Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">{service.name}</p>
          {inCart && (
            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 animate-scale-in" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {service.code}
          </span>
          {service.subCategory && (
            <span className="text-xs text-muted-foreground">{service.subCategory}</span>
          )}
        </div>
        {service.description && (
          <p className="text-xs text-muted-foreground mt-1 truncate">{service.description}</p>
        )}
      </div>

      {/* Price & Actions */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold text-foreground">{formatPrice(service.price)}</p>
          {service.price === 0 && (
            <span className="text-xs text-muted-foreground">No charge</span>
          )}
        </div>

        {inCart && cartItem ? (
          <QuantityStepper
            qty={cartItem.qty}
            onIncrement={() => onUpdateQty(cartItem.itemId, cartItem.qty + 1)}
            onDecrement={() => onUpdateQty(cartItem.itemId, cartItem.qty - 1)}
            onRemove={() => onRemove(cartItem.itemId)}
            ariaLabel={`Quantity for ${service.name}`}
          />
        ) : (
          <Button
            size="sm"
            onClick={() => onAdd(service)}
            className="h-8 gap-1 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        )}
      </div>
    </div>
  );
}
