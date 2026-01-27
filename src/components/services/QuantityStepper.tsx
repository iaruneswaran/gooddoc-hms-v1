import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
}

export function QuantityStepper({
  qty,
  onIncrement,
  onDecrement,
  onRemove,
  size = "md",
  className,
  ariaLabel = "Quantity",
}: QuantityStepperProps) {
  const isSmall = size === "sm";
  
  const handleDecrement = () => {
    if (qty === 1) {
      onRemove();
    } else {
      onDecrement();
    }
  };

  return (
    <div
      role="spinbutton"
      aria-label={ariaLabel}
      aria-valuenow={qty}
      aria-valuemin={0}
      className={cn(
        "flex items-center gap-0.5 bg-muted rounded-lg p-0.5 animate-scale-in",
        className
      )}
    >
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "transition-all",
          isSmall ? "h-6 w-6" : "h-7 w-7"
        )}
        onClick={handleDecrement}
        aria-label={qty === 1 ? "Remove item" : "Decrease quantity"}
      >
        {qty === 1 ? (
          <Trash2 className={cn("text-destructive", isSmall ? "w-3 h-3" : "w-3.5 h-3.5")} />
        ) : (
          <Minus className={isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} />
        )}
      </Button>
      <span 
        className={cn(
          "font-semibold text-center tabular-nums",
          isSmall ? "text-xs w-6" : "text-sm w-8"
        )}
      >
        {qty}
      </span>
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "transition-all",
          isSmall ? "h-6 w-6" : "h-7 w-7"
        )}
        onClick={onIncrement}
        aria-label="Increase quantity"
      >
        <Plus className={isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} />
      </Button>
    </div>
  );
}
