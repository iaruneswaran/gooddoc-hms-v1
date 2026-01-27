import { useState, useCallback, useMemo, useRef } from "react";
import { CartItem, ServiceItem, Totals } from "@/types/booking/ipAdmission";
import { calcTotals } from "@/utils/billing/totals";
import { toast } from "sonner";

interface UndoAction {
  type: 'add' | 'remove' | 'update_qty';
  item: CartItem;
  previousQty?: number;
}

export function useUndoableCart(baseCharge: number = 0) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [globalDiscountAmt, setGlobalDiscountAmt] = useState<number>(0);
  const undoTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const undoActionRef = useRef<Map<string, UndoAction>>(new Map());

  const clearUndoTimeout = useCallback((key: string) => {
    const existing = undoTimeoutRef.current.get(key);
    if (existing) {
      clearTimeout(existing);
      undoTimeoutRef.current.delete(key);
    }
    undoActionRef.current.delete(key);
  }, []);

  const executeUndo = useCallback((key: string) => {
    const action = undoActionRef.current.get(key);
    if (!action) return;

    setCart((prev) => {
      switch (action.type) {
        case 'add':
          // Undo add = remove the item or decrement qty
          const existingAdd = prev.find((item) => item.itemId === action.item.itemId);
          if (existingAdd) {
            if (existingAdd.qty <= 1) {
              return prev.filter((item) => item.itemId !== action.item.itemId);
            }
            return prev.map((item) =>
              item.itemId === action.item.itemId
                ? { ...item, qty: item.qty - 1 }
                : item
            );
          }
          return prev;

        case 'remove':
          // Undo remove = add the item back
          return [...prev, action.item];

        default:
          return prev;
      }
    });

    clearUndoTimeout(key);
    toast.dismiss(key);
  }, [clearUndoTimeout]);

  const addToCart = useCallback((service: ServiceItem) => {
    const undoKey = `add-${service.id}-${Date.now()}`;
    
    setCart((prev) => {
      const existing = prev.find((item) => item.itemId === service.id);
      if (existing) {
        // Merge: increment quantity
        const updatedCart = prev.map((item) =>
          item.itemId === service.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
        return updatedCart;
      }
      // New item
      return [
        ...prev,
        {
          itemId: service.id,
          code: service.code,
          name: service.name,
          category: service.category,
          subCategory: service.subCategory,
          unitPrice: service.price,
          taxPct: service.taxPct,
          qty: 1,
          discountAmt: 0,
          description: service.description,
          addedAt: new Date().toISOString(),
        },
      ];
    });

    // Store undo action
    undoActionRef.current.set(undoKey, {
      type: 'add',
      item: {
        itemId: service.id,
        code: service.code,
        name: service.name,
        category: service.category,
        subCategory: service.subCategory,
        unitPrice: service.price,
        taxPct: service.taxPct,
        qty: 1,
        discountAmt: 0,
        addedAt: new Date().toISOString(),
      },
    });

    // Show toast with undo
    toast.success(`Added ${service.name}`, {
      id: undoKey,
      duration: 5000,
      action: {
        label: "Undo",
        onClick: () => executeUndo(undoKey),
      },
    });

    // Auto-clear after timeout
    const timeout = setTimeout(() => {
      clearUndoTimeout(undoKey);
    }, 5000);
    undoTimeoutRef.current.set(undoKey, timeout);
  }, [executeUndo, clearUndoTimeout]);

  const updateQty = useCallback((itemId: string, qty: number) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  }, []);

  const updateDiscount = useCallback((itemId: string, discountAmt: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.itemId === itemId) {
          const maxDiscount = item.unitPrice * item.qty;
          return { ...item, discountAmt: Math.min(maxDiscount, Math.max(0, discountAmt)) };
        }
        return item;
      })
    );
  }, []);

  const updateAddedAt = useCallback((itemId: string, addedAt: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, addedAt } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    const undoKey = `remove-${itemId}-${Date.now()}`;
    let removedItem: CartItem | undefined;

    setCart((prev) => {
      removedItem = prev.find((item) => item.itemId === itemId);
      return prev.filter((item) => item.itemId !== itemId);
    });

    if (removedItem) {
      // Store undo action
      undoActionRef.current.set(undoKey, {
        type: 'remove',
        item: removedItem,
      });

      // Show toast with undo
      toast.info(`Removed ${removedItem.name}`, {
        id: undoKey,
        duration: 5000,
        action: {
          label: "Undo",
          onClick: () => executeUndo(undoKey),
        },
      });

      // Auto-clear after timeout
      const timeout = setTimeout(() => {
        clearUndoTimeout(undoKey);
      }, 5000);
      undoTimeoutRef.current.set(undoKey, timeout);
    }
  }, [executeUndo, clearUndoTimeout]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const updateGlobalDiscount = useCallback((discountAmt: number) => {
    setGlobalDiscountAmt(Math.max(0, discountAmt));
  }, []);

  const baseTotals: Totals = calcTotals(cart, baseCharge);
  
  // Apply global discount to the totals
  const totals: Totals = useMemo(() => {
    const clampedDiscount = Math.min(globalDiscountAmt, baseTotals.subtotal);
    return {
      ...baseTotals,
      discountTotal: baseTotals.discountTotal + clampedDiscount,
      netPayable: baseTotals.subtotal - baseTotals.discountTotal - clampedDiscount,
    };
  }, [baseTotals, globalDiscountAmt]);

  return {
    cart,
    totals,
    globalDiscountAmt,
    addToCart,
    updateQty,
    updateDiscount,
    updateAddedAt,
    removeFromCart,
    clearCart,
    updateGlobalDiscount,
  };
}
