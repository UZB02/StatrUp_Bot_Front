export function formatCurrency(value, currency = 'UZS', locale = 'uz-UZ') {
  if (typeof value !== 'number') value = Number(value) || 0

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0, // sonni butun qilib ko‘rsatish
    maximumFractionDigits: 0,
  }).format(value)
}
