import { ref } from 'vue'
import api from '@/utils/api.js'

export function useDashboardLatest(params) {
  const latest = ref([])
  const total = ref(0)

  const loadLatest = async () => {
    const { data } = await api.get('/dashboard/latest', {
      params: params(),
    })

    latest.value = data.data.map((tx) => ({
      ...tx,
      productName: tx.items?.map((i) => i.product?.name).join(', '),
      amount: tx.items?.reduce((s, i) => s + i.amount, 0),
      filialName: tx.filial?.name || '',
    }))

    total.value = data.pagination.total
  }

  return { latest, total, loadLatest }
}
