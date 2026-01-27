import { CartItem } from "@/types/booking/ipAdmission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { QuantityStepper } from "./QuantityStepper";
import { CalendarDays, Trash2 } from "lucide-react";
import { format, setHours, setMinutes } from "date-fns";
import { useState } from "react";

interface CartLineItemProps {
  item: CartItem;
  onUpdateQty: (itemId: string, qty: number) => void;
  onUpdateDiscount: (itemId: string, discountAmt: number) => void;
  onUpdateAddedAt: (itemId: string, addedAt: string) => void;
  onRemove: (itemId: string) => void;
  formatPrice: (amount: number) => string;
}

export function CartLineItem({
  item,
  onUpdateQty,
  onUpdateDiscount,
  onUpdateAddedAt,
  onRemove,
  formatPrice,
}: CartLineItemProps) {
  const addedDate = new Date(item.addedAt);
  const lineSubtotal = item.unitPrice * item.qty;
  const lineTotal = lineSubtotal - (item.discountAmt || 0);
  const [discountInput, setDiscountInput] = useState((item.discountAmt || 0).toString());

  const handleDiscountBlur = () => {
    const val = parseFloat(discountInput);
    if (!isNaN(val) && val >= 0 && val <= lineSubtotal) {
      onUpdateDiscount(item.itemId, val);
    } else {
      setDiscountInput((item.discountAmt || 0).toString());
    }
  };

  return (
    <Card className="shadow-sm border-border animate-fade-in">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-muted-foreground">{item.code}</p>
                  <span className="text-muted-foreground">•</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button 
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        aria-label="Change service date"
                      >
                        <CalendarDays className="w-3 h-3" />
                        {format(addedDate, 'dd MMM, HH:mm')}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={addedDate}
                        onSelect={(date) => {
                          if (date) {
                            const newDate = setMinutes(setHours(date, addedDate.getHours()), addedDate.getMinutes());
                            onUpdateAddedAt(item.itemId, newDate.toISOString());
                          }
                        }}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-muted-foreground hover:text-destructive flex-shrink-0"
                onClick={() => onRemove(item.itemId)}
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Qty controls and discount */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <QuantityStepper
                  qty={item.qty}
                  onIncrement={() => onUpdateQty(item.itemId, item.qty + 1)}
                  onDecrement={() => onUpdateQty(item.itemId, item.qty - 1)}
                  onRemove={() => onRemove(item.itemId)}
                  size="sm"
                  ariaLabel={`Quantity for ${item.name}`}
                />

                {/* Discount */}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Disc:</span>
                  <div className="relative flex items-center">
                    <span className="absolute left-2 text-xs text-muted-foreground pointer-events-none">₹</span>
                    <Input
                      type="number"
                      min="0"
                      max={lineSubtotal}
                      value={discountInput}
                      onChange={(e) => setDiscountInput(e.target.value)}
                      onBlur={handleDiscountBlur}
                      className="h-6 w-16 pl-5 pr-1.5 text-xs text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      aria-label={`Discount for ${item.name}`}
                    />
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <span className="text-sm font-semibold">
                  {formatPrice(lineTotal)}
                </span>
                {(item.qty > 1 || (item.discountAmt && item.discountAmt > 0)) && (
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(item.unitPrice)} × {item.qty}
                    {item.discountAmt && item.discountAmt > 0 && (
                      <span className="text-emerald-600 dark:text-emerald-400 ml-1">-{formatPrice(item.discountAmt)}</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
