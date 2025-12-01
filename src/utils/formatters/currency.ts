/**
 * Currency formatting utilities
 * Formats prices in Moroccan Dirham (MAD)
 */

export function formatPrice(price: number | string | undefined | null): string {
  if (price === null || price === undefined) {
    return '0.00 MAD'
  }

  const numPrice = typeof price === 'string' ? parseFloat(price) : price

  if (isNaN(numPrice)) {
    return '0.00 MAD'
  }

  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numPrice)
}

export function formatCurrency(amount: number | string | undefined | null): string {
  return formatPrice(amount)
}
