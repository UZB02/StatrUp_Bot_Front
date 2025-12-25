import { ref, watch } from 'vue'
import api from '@/utils/api'

export function useTransactionForm(type = 'add') {
  const filials = ref([])
  const products = ref([])

  const selectedFilial = ref(null)
  const selectedProduct = ref(null)

  const quantity = ref(1)
  const amount = ref(0)

  // Filiallar
  api.get('/filials').then((res) => {
    filials.value = res.data
  })

  // 🔥 FILIAL O‘ZGARGANDA MAHSULOTLARNI YUKLASH
  watch(selectedFilial, async (filial) => {
    selectedProduct.value = null
    products.value = []
    amount.value = 0

    if (!filial) return

    // Dialog turiga qarab endpoint tanlash
    let endpoint = '/products'
    if (type === 'spend') {
      endpoint = '/transactions/products'
    }

    try {
      const res = await api.get(endpoint, { params: { filialId: filial._id } })
      products.value = res.data
    } catch (err) {
      console.error('Products fetch error:', err)
    }
  })

  // Miqdor yoki product o‘zgarsa summa hisoblash
  watch([quantity, selectedProduct], () => {
    if (selectedProduct.value && quantity.value > 0) {
      amount.value = selectedProduct.value.price * quantity.value
    } else {
      amount.value = 0
    }
  })

  const reset = () => {
    selectedFilial.value = null
    selectedProduct.value = null
    quantity.value = 1
    amount.value = 0
    products.value = []
  }

  return {
    filials,
    products,
    selectedFilial,
    selectedProduct,
    quantity,
    amount,
    reset,
  }
}
