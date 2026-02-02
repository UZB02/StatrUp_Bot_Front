import { ref } from 'vue'
import api from '@/utils/api.js'

export function useDashboardProducts(params, filters) {
  const productChartData = ref({
    labels: [],
    datasets: [
      { label: 'Tushum', backgroundColor: '#3b82f6', data: [] },
      { label: 'Xarajat', backgroundColor: '#f97316', data: [] },
    ],
  })

  const productGrowth = ref([])

  const loadProductComparison = async () => {
    if (!filters.value.filial) return

    const { data } = await api.get('/dashboard/product-comparison', {
      params: params(),
    })

    productChartData.value.labels = data.map((i) => i.productName)
    productChartData.value.datasets[0].data = data.map((i) => i.earn)
    productChartData.value.datasets[1].data = data.map((i) => i.spend)
  }

  const loadProductGrowth = async () => {
    if (!filters.value.filial) {
      productGrowth.value = []
      return
    }

    const { data } = await api.get('/dashboard/product-growth', {
      params: params(),
    })

    productGrowth.value = data
  }

  return {
    productChartData,
    productGrowth,
    loadProductComparison,
    loadProductGrowth,
  }
}
