import { useState, useCallback, useMemo } from "react";
import { CartItem, ServiceItem, Totals } from "@/types/booking/ipAdmission";
import { calcTotals } from "@/utils/billing/totals";

export function useServicesCart(baseCharge: number = 0) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [globalDiscountPct, setGlobalDiscountPct] = useState<number>(0);

  const addToCart = useCallback((service: ServiceItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.itemId === service.id);
      if (existing) {
        return prev.map((item) =>
          item.itemId === service.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          itemId: service.id,
          code: service.code,
          name: service.name,
          category: service.category,
          unitPrice: service.price,
          taxPct: service.taxPct,
          qty: 1,
          discountPct: 0,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  }, []);

  const updateQty = useCallback((itemId: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  }, []);

  const updateDiscount = useCallback((itemId: string, discountPct: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.itemId === itemId
          ? { ...item, discountPct: Math.min(100, Math.max(0, discountPct)) }
          : item
      )
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
    setCart((prev) => prev.filter((item) => item.itemId !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const updateGlobalDiscount = useCallback((discountPct: number) => {
    setGlobalDiscountPct(Math.min(100, Math.max(0, discountPct)));
  }, []);

  const baseTotals: Totals = calcTotals(cart, baseCharge);
  
  // Apply global discount to the totals
  const totals: Totals = useMemo(() => {
    const globalDiscountAmount = (baseTotals.subtotal * globalDiscountPct) / 100;
    return {
      ...baseTotals,
      discountTotal: baseTotals.discountTotal + globalDiscountAmount,
      netPayable: baseTotals.subtotal - baseTotals.discountTotal - globalDiscountAmount,
    };
  }, [baseTotals, globalDiscountPct]);

  return {
    cart,
    totals,
    globalDiscountPct,
    addToCart,
    updateQty,
    updateDiscount,
    updateAddedAt,
    removeFromCart,
    clearCart,
    updateGlobalDiscount,
  };
}
