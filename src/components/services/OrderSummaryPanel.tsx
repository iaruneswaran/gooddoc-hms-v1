import { CartItem, Totals } from "@/types/booking/ipAdmission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartLineItem } from "./CartLineItem";
import { Receipt, FileText } from "lucide-react";

interface OrderSummaryPanelProps {
  cart: CartItem[];
  totals: Totals;
  globalDiscountAmt: number;
  patientId: string;
  isGeneratingBill: boolean;
  onUpdateQty: (itemId: string, qty: number) => void;
  onUpdateDiscount: (itemId: string, discountAmt: number) => void;
  onUpdateAddedAt: (itemId: string, addedAt: string) => void;
  onRemove: (itemId: string) => void;
  onUpdateGlobalDiscount: (discountAmt: number) => void;
  onGenerateBill: () => void;
  formatPrice: (amount: number) => string;
}

export function OrderSummaryPanel({
  cart,
  totals,
  globalDiscountAmt,
  patientId,
  isGeneratingBill,
  onUpdateQty,
  onUpdateDiscount,
  onUpdateAddedAt,
  onRemove,
  onUpdateGlobalDiscount,
  onGenerateBill,
  formatPrice,
}: OrderSummaryPanelProps) {
  const finalTotal = totals.subtotal - totals.discountTotal;

  return (
    <div className="w-[450px] border-l border-border flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border bg-primary">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-primary-foreground">Order Summary</h3>
            <p className="text-xs text-primary-foreground/80 mt-0.5">
              {cart.length} item{cart.length !== 1 ? 's' : ''} • {patientId}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
              <FileText className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground">No services added</p>
            <p className="text-xs text-muted-foreground mt-1">
              Select services from the catalog to add them to the bill
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-2" role="list" aria-label="Cart items">
            {cart.map((item) => (
              <CartLineItem
                key={item.itemId}
                item={item}
                onUpdateQty={onUpdateQty}
                onUpdateDiscount={onUpdateDiscount}
                onUpdateAddedAt={onUpdateAddedAt}
                onRemove={onRemove}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Totals & Actions */}
      <div className="p-4 border-t border-border bg-background" role="region" aria-live="polite" aria-label="Order totals">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatPrice(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Discount</span>
            <div className="relative flex items-center">
              <span className="absolute left-2.5 text-xs font-medium text-muted-foreground pointer-events-none">₹</span>
              <Input
                type="number"
                min="0"
                max={totals.subtotal}
                value={globalDiscountAmt || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    onUpdateGlobalDiscount(Math.min(val, totals.subtotal));
                  } else if (e.target.value === '') {
                    onUpdateGlobalDiscount(0);
                  }
                }}
                className="h-8 w-24 pl-6 pr-2 text-sm text-right font-medium border-dashed focus:border-solid focus:border-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0.00"
                aria-label="Bill-level discount"
              />
            </div>
          </div>
          <div className="flex justify-between pt-3 border-t border-border">
            <span className="text-base font-semibold">Total Amount</span>
            <span className="text-lg font-bold text-primary">{formatPrice(finalTotal)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            className="w-full h-11"
            size="lg"
            disabled={cart.length === 0 || isGeneratingBill}
            onClick={onGenerateBill}
            aria-label="Generate bill"
          >
            {isGeneratingBill ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Generating Bill...
              </>
            ) : (
              <>
                <Receipt className="w-4 h-4 mr-2" />
                Generate Bill
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
