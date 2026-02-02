import { ref } from 'vue'
import api from '@/utils/api.js'

export function useDashboardSummary(params) {
  const summary = ref({
    earn: 0,
    spend: 0,
    balance: 0,
    earnCount: 0,
    spendCount: 0,
  })

  const loadSummary = async () => {
    const { data } = await api.get('/dashboard/summary', {
      params: params(),
    })
    summary.value = data
  }

  return { summary, loadSummary }
}
