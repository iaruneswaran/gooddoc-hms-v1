/**
 * Price calculation utilities for hospital pricing catalog
 */

import { PricingCategory } from "@/types/pricing-item";
import { 
  generateCategoryCode, 
  PricingCategory as ConfigCategory 
} from "@/config/pricing-categories";

export interface PriceCalculation {
  basePrice: number;
  markupPct?: number;
  discountPct?: number;
  taxPct?: number;
}

export interface PriceTier {
  cash?: number;
  insurance?: number;
  corporate?: number;
}

/**
 * Calculate net price from base price and modifiers
 * Formula: Net = (Base + Markup - Discount) + Tax
 */
export function calcNetPrice({
  basePrice,
  markupPct = 0,
  discountPct = 0,
  taxPct = 0,
}: PriceCalculation): number {
  const markup = basePrice * (markupPct / 100);
  const discount = (basePrice + markup) * (discountPct / 100);
  const taxable = basePrice + markup - discount;
  const tax = taxable * (taxPct / 100);
  const net = basePrice + markup - discount + tax;
  
  return round2(net);
}

/**
 * Round to 2 decimal places
 */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Suggest price tiers based on net price
 * Cash = net, Insurance = 92% of net, Corporate = 96% of net
 */
export function suggestTiers(net: number): PriceTier {
  return {
    cash: round2(net),
    insurance: round2(net * 0.92),
    corporate: round2(net * 0.96),
  };
}

/**
 * Format price breakdown for display
 */
export function getPriceBreakdown(calc: PriceCalculation): string[] {
  const { basePrice, markupPct = 0, discountPct = 0, taxPct = 0 } = calc;
  const markup = basePrice * (markupPct / 100);
  const discount = (basePrice + markup) * (discountPct / 100);
  const taxable = basePrice + markup - discount;
  const tax = taxable * (taxPct / 100);
  const net = calcNetPrice(calc);

  const breakdown: string[] = [
    `Base Price: ₹${basePrice.toFixed(2)}`,
  ];

  if (markupPct > 0) {
    breakdown.push(`+ Markup (${markupPct}%): ₹${markup.toFixed(2)}`);
  }

  if (discountPct > 0) {
    breakdown.push(`- Discount (${discountPct}%): ₹${discount.toFixed(2)}`);
  }

  breakdown.push(`= Subtotal: ₹${taxable.toFixed(2)}`);

  if (taxPct > 0) {
    breakdown.push(`+ Tax (${taxPct}%): ₹${tax.toFixed(2)}`);
  }

  breakdown.push(`= Net Price: ₹${net.toFixed(2)}`);

  return breakdown;
}

/**
 * Generate a unique internal code suggestion
 * @deprecated Use generateCategoryCode from pricing-categories.ts instead
 */
export function generateInternalCode(category: string, department: string): string {
  // Map old category names to new ones for backward compatibility
  const categoryMap: Record<string, ConfigCategory> = {
    "Lab Test": "Lab Test",
    "Doctor Fee": "Consultation",
    "Procedure": "Procedure/OT",
    "Imaging": "Radiology/Imaging",
    "Room": "Room/Bed",
    "Pharmacy": "Service/Consumable",
    "Package": "Package",
  };
  
  const mappedCategory = categoryMap[category] || (category as ConfigCategory);
  return generateCategoryCode(mappedCategory, department);
}
