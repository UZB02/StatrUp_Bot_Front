import { ref } from 'vue'
import api from '@/utils/api.js'

export function useDashboardStats(params, filters) {
  const chartData = ref({
    labels: [],
    datasets: [
      { label: 'Tushum', backgroundColor: '#22c55e', data: [] },
      { label: 'Xarajat', backgroundColor: '#ef4444', data: [] },
    ],
  })

  const loadStats = async () => {
    const { data } = await api.get('/dashboard/stats', {
      params: params(),
    })

    const period = filters.value.period

    if (period === 'year') {
      const labels = [
        'Yanvar',
        'Fevral',
        'Mart',
        'Aprel',
        'May',
        'Iyun',
        'Iyul',
        'Avgust',
        'Sentyabr',
        'Oktyabr',
        'Noyabr',
        'Dekabr',
      ]
      const earn = new Array(12).fill(0)
      const spend = new Array(12).fill(0)

      data.forEach((i) => {
        const m = new Date(i.label).getMonth()
        earn[m] = i.earn
        spend[m] = i.spend
      })

      chartData.value.labels = labels
      chartData.value.datasets[0].data = earn
      chartData.value.datasets[1].data = spend
    } else if (period === 'month') {
      const days = new Date(filters.value.year, filters.value.month, 0).getDate()
      chartData.value.labels = Array.from({ length: days }, (_, i) => i + 1)
      chartData.value.datasets[0].data = new Array(days).fill(0)
      chartData.value.datasets[1].data = new Array(days).fill(0)

      data.forEach((i) => {
        const d = new Date(i.label).getDate() - 1
        chartData.value.datasets[0].data[d] = i.earn
        chartData.value.datasets[1].data[d] = i.spend
      })
    } else if (period === 'week') {
      const labels = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya']
      const earn = new Array(7).fill(0)
      const spend = new Array(7).fill(0)

      data.forEach((i) => {
        const idx = (new Date(i.label).getDay() + 6) % 7
        earn[idx] = i.earn
        spend[idx] = i.spend
      })

      chartData.value.labels = labels
      chartData.value.datasets[0].data = earn
      chartData.value.datasets[1].data = spend
    } else if (period === 'day') {
      chartData.value.labels = data.map((i) => i.label)
      chartData.value.datasets[0].data = data.map((i) => i.earn)
      chartData.value.datasets[1].data = data.map((i) => i.spend)
    }
  }

  return { chartData, loadStats }
}
