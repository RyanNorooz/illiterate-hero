export function dateTimeFormat(date: string | number | Date, locale?: string) {
  return (
    date &&
    new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(new Date(date))
  )
}

export function priceFormat(price: number, locale?: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(price)
}
