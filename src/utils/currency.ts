/**
 * Format amount in paise to INR currency string
 * @param amountInPaise - Amount in paise (smallest currency unit)
 * @returns Formatted string like "₹1,23,456"
 */
export function formatINR(amountInPaise: number): string {
  const amount = amountInPaise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format large amounts with abbreviations
 * @param amountInPaise - Amount in paise
 * @returns Formatted string like "₹1.2L" or "₹3.4Cr"
 */
export function formatINRAbbreviated(amountInPaise: number): string {
  const amount = amountInPaise / 100;
  
  if (amount >= 10000000) { // 1 Crore+
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) { // 1 Lakh+
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) { // 1 Thousand+
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  
  return formatINR(amountInPaise);
}
