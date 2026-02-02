import { ref } from 'vue'
import api from '@/utils/api.js'

export function useDashboardFilters() {
  const filters = ref({
    period: 'year',
    year: new Date().getFullYear(),
    month: null,
    from: null,
    to: null,
    filial: null,
    product: null,
  })

  const periods = [
    { label: 'Yillik', value: 'year' },
    { label: 'Oylik', value: 'month' },
    { label: 'Haftalik', value: 'week' },
    { label: 'Kunlik', value: 'day' },
  ]

  const months = [
    { label: 'Yanvar', value: 1 },
    { label: 'Fevral', value: 2 },
    { label: 'Mart', value: 3 },
    { label: 'Aprel', value: 4 },
    { label: 'May', value: 5 },
    { label: 'Iyun', value: 6 },
    { label: 'Iyul', value: 7 },
    { label: 'Avgust', value: 8 },
    { label: 'Sentyabr', value: 9 },
    { label: 'Oktyabr', value: 10 },
    { label: 'Noyabr', value: 11 },
    { label: 'Dekabr', value: 12 },
  ]

  const filials = ref([])
  const products = ref([])

  const loadFilials = async () => {
    const { data } = await api.get('/filials')
    filials.value = data
  }

  const loadProducts = async () => {
    const url = filters.value.filial
      ? `/products/by-filial?filial=${filters.value.filial}`
      : '/products'

    const { data } = await api.get(url)
    products.value = data
  }

  return {
    filters,
    periods,
    months,
    filials,
    products,
    loadFilials,
    loadProducts,
  }
}
