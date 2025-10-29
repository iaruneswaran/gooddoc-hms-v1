import React, { useState } from 'react';
import { Percent, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DiscountType } from '@/types/pricing';
import { useFeatureFlags } from '@/contexts/FeatureFlagsContext';

interface GlobalDiscountControlsProps {
  discountType: DiscountType;
  discountValue: number;
  applyPretax: boolean;
  couponCode: string;
  onDiscountTypeChange: (type: DiscountType) => void;
  onDiscountValueChange: (value: number) => void;
  onApplyPretaxChange: (pretax: boolean) => void;
  onCouponCodeChange: (code: string) => void;
  onApplyCoupon: () => void;
  maxValue: number;
}

export function GlobalDiscountControls({
  discountType,
  discountValue,
  applyPretax,
  couponCode,
  onDiscountTypeChange,
  onDiscountValueChange,
  onApplyPretaxChange,
  onCouponCodeChange,
  onApplyCoupon,
  maxValue,
}: GlobalDiscountControlsProps) {
  const { flags } = useFeatureFlags();

  if (!flags.globalDiscount_summary) {
    return null;
  }

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-md border border-border">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Global Discount</Label>
      </div>

      {/* Discount Input */}
      <div className="flex gap-2">
        <Input
          type="number"
          value={discountValue || ''}
          onChange={(e) => onDiscountValueChange(parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="flex-1"
          min="0"
          max={discountType === 'percent' ? 100 : maxValue}
        />
        <Button
          variant={discountType === 'flat' ? 'default' : 'outline'}
          onClick={() => onDiscountTypeChange('flat')}
          className="w-16"
          size="sm"
        >
          <DollarSign className="h-4 w-4" />
        </Button>
        <Button
          variant={discountType === 'percent' ? 'default' : 'outline'}
          onClick={() => onDiscountTypeChange('percent')}
          className="w-16"
          size="sm"
        >
          <Percent className="h-4 w-4" />
        </Button>
      </div>

      {/* Apply Pre-tax Toggle */}
      {flags.allow_post_tax_global_discount && (
        <div className="flex items-center justify-between">
          <Label htmlFor="apply-pretax" className="text-xs">
            Apply pre-tax
          </Label>
          <Switch
            id="apply-pretax"
            checked={applyPretax}
            onCheckedChange={onApplyPretaxChange}
          />
        </div>
      )}

      {/* Coupon Code */}
      <div className="space-y-2">
        <Label htmlFor="coupon-code" className="text-xs text-muted-foreground">
          Coupon code (optional)
        </Label>
        <div className="flex gap-2">
          <Input
            id="coupon-code"
            value={couponCode}
            onChange={(e) => onCouponCodeChange(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1"
          />
          <Button size="sm" variant="outline" onClick={onApplyCoupon}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
