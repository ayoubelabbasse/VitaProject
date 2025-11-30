export const formatCurrency = (amount: number, currency: string = 'MAD'): string => {
  return new Intl.NumberFormat('ar-MA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPrice = (price: number): string => {
  return `${price.toFixed(2)} MAD`;
}; 