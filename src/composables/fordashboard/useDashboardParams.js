export function useDashboardParams(filters, page, limit) {
  return () => {
    let from = filters.value.from ? new Date(filters.value.from) : null
    let to = filters.value.to ? new Date(filters.value.to) : null

    const period = filters.value.period

    if (period === 'day' && from) {
      from.setHours(0, 0, 0, 0)
      to = new Date(from)
      to.setHours(23, 59, 59, 999)
    } else if (period === 'week' && from) {
      const diff = (from.getDay() + 6) % 7
      from.setDate(from.getDate() - diff)
      from.setHours(0, 0, 0, 0)

      to = new Date(from)
      to.setDate(from.getDate() + 6)
      to.setHours(23, 59, 59, 999)
    } else if (period === 'month') {
      from = new Date(filters.value.year, filters.value.month - 1, 1)
      to = new Date(filters.value.year, filters.value.month, 0)
    } else if (period === 'year') {
      from = new Date(filters.value.year, 0, 1)
      to = new Date(filters.value.year, 11, 31)
    }

    return {
      period,
      from: from?.toISOString(),
      to: to?.toISOString(),
      year: filters.value.year,
      month: filters.value.month,
      filial: filters.value.filial,
      product: filters.value.product,
      page: page.value,
      limit: limit.value,
    }
  }
}
