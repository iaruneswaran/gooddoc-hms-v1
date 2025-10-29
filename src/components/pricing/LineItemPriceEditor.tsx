import React, { useState } from 'react';
import { Pencil, Lock, Unlock, Save, X, RotateCcw, MoreVertical, Tag, DollarSign, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LineItem, PriceEditState } from '@/types/pricing';
import { formatCurrency } from '@/lib/pricingEngine';
import { cn } from '@/lib/utils';
import { useFeatureFlags } from '@/contexts/FeatureFlagsContext';

interface LineItemPriceEditorProps {
  item: LineItem;
  onPriceUpdate: (itemId: string, newPrice: number, reason?: string) => void;
  onDiscountApply: (itemId: string, discountType: 'flat' | 'percent', value: number, reason?: string) => void;
  onWaiveOff: (itemId: string, reason: string) => void;
  onOpenModal: () => void;
}

export function LineItemPriceEditor({
  item,
  onPriceUpdate,
  onDiscountApply,
  onWaiveOff,
  onOpenModal,
}: LineItemPriceEditorProps) {
  const { flags } = useFeatureFlags();
  const [editState, setEditState] = useState<PriceEditState>({
    isEditing: false,
    isLocked: flags.priceEdit_lock,
  });
  const [tempValue, setTempValue] = useState<string>('');
  const [reason, setReason] = useState('');

  const effectivePrice = item.overridePrice ?? item.basePrice;
  const isOverridden = item.overridePrice !== undefined;

  const handleStartEdit = () => {
    if (editState.isLocked) return;
    setEditState({ ...editState, isEditing: true });
    setTempValue(effectivePrice.toString());
  };

  const handleSave = () => {
    const newPrice = parseFloat(tempValue);
    if (isNaN(newPrice) || newPrice < 0) return;

    onPriceUpdate(item.id, newPrice, reason || undefined);
    setEditState({ ...editState, isEditing: false });
    setReason('');
  };

  const handleCancel = () => {
    setEditState({ ...editState, isEditing: false });
    setTempValue('');
    setReason('');
  };

  const handleReset = () => {
    onPriceUpdate(item.id, item.basePrice);
    setEditState({ ...editState, isEditing: false });
    setReason('');
  };

  const handleUnlock = () => {
    setEditState({ ...editState, isLocked: false });
  };

  // Inline edit pattern
  if (flags.priceEdit_inline && editState.isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-32 h-8 text-sm"
            placeholder="Enter price"
            autoFocus
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave}>
                  <Save className="h-4 w-4 text-green-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancel}>
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cancel</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {isOverridden && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset to default</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <Input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for change (optional)"
          className="h-8 text-xs"
        />
      </div>
    );
  }

  // Locked state
  if (flags.priceEdit_lock && editState.isLocked) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">₹{formatCurrency(effectivePrice)}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleUnlock}>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Override requires justification and may need approval</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  // Default view with inline pencil and quick actions
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-baseline gap-1">
        {isOverridden && (
          <span className="text-xs text-muted-foreground line-through">₹{formatCurrency(item.basePrice)}</span>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 hover:bg-transparent"
          onClick={handleStartEdit}
        >
          <span className="text-sm font-semibold">₹{formatCurrency(effectivePrice)}</span>
          {flags.priceEdit_inline && (
            <Pencil className="ml-1 h-3 w-3 text-muted-foreground" />
          )}
        </Button>
      </div>

      {isOverridden && (
        <Badge variant="secondary" className="text-[10px] px-1 py-0">
          Edited
        </Badge>
      )}

      {item.approval?.required && (
        <Badge variant="outline" className="text-[10px] px-1 py-0 border-orange-500 text-orange-700">
          {item.approval.status === 'pending' ? 'Requires approval' : `Approved by ${item.approval.approver}`}
        </Badge>
      )}

      {flags.priceEdit_quickActions && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-6 w-6">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDiscountApply(item.id, 'percent', 10)}>
              <Tag className="mr-2 h-4 w-4" />
              Apply discount
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenModal}>
              <DollarSign className="mr-2 h-4 w-4" />
              Set custom price
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onWaiveOff(item.id, 'Waived by staff')}>
              <Ban className="mr-2 h-4 w-4" />
              Waive off
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {flags.priceEdit_modal && (
        <Button
          size="sm"
          variant="ghost"
          className="h-6 text-xs text-primary hover:text-primary/80"
          onClick={onOpenModal}
        >
          Edit price
        </Button>
      )}
    </div>
  );
}
