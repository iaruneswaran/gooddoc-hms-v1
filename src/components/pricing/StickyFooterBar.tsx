import React from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/pricingEngine';
import { useFeatureFlags } from '@/contexts/FeatureFlagsContext';
import { AppointmentTotals } from '@/types/pricing';

interface StickyFooterBarProps {
  totals: AppointmentTotals;
  itemCount: number;
  onGenerateInvoice: () => void;
}

export function StickyFooterBar({ totals, itemCount, onGenerateInvoice }: StickyFooterBarProps) {
  const { flags } = useFeatureFlags();

  if (!flags.globalDiscount_stickyBar) {
    return null;
  }

  const globalDiscountAmount =
    totals.globalDiscountType && totals.globalDiscountValue
      ? totals.globalDiscountType === 'flat'
        ? totals.globalDiscountValue
        : (totals.subtotal * totals.globalDiscountValue) / 100
      : 0;

  return (
    <div className="fixed bottom-0 left-[196px] right-0 bg-background border-t border-border shadow-lg z-40">
      <div className="max-w-[1600px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-xs text-muted-foreground">Total Items</p>
              <p className="text-sm font-semibold">{itemCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Subtotal</p>
              <p className="text-sm font-semibold">₹{formatCurrency(totals.subtotal)}</p>
            </div>
            {globalDiscountAmount > 0 && (
              <div>
                <p className="text-xs text-muted-foreground">Global Discount</p>
                <p className="text-sm font-semibold text-green-600">
                  -₹{formatCurrency(globalDiscountAmount)}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Taxes (GST 18%)</p>
              <p className="text-sm font-semibold">
                ₹{formatCurrency(totals.cgst + totals.sgst)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Net Payable</p>
              <p className="text-lg font-bold text-primary">
                ₹{formatCurrency(totals.netPayable)}
              </p>
            </div>
          </div>

          <Button size="lg" onClick={onGenerateInvoice}>
            Generate Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}
