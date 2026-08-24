export function formatCurrency(amount, currency = 'USD') {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
