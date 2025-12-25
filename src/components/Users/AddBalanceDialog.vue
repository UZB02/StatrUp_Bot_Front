<script setup>
import { computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import api from '@/utils/api'

/* ================= STATE ================= */
const filials = ref([])
const products = ref([])
const selectedFilial = ref(null)
const basket = ref([])
const search = ref('')
const productDialog = ref(false)
const isLoading = ref(false)

/* ================= PROPS / EMITS ================= */
const props = defineProps({
  modelValue: Boolean,
  user: Object
})
const emit = defineEmits(['update:modelValue', 'saved'])

const visible = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

/* ================= FORMAT ================= */
const formatAmount = (value = 0) =>
  new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(value)

/* ================= TOTAL ================= */
const totalAmount = computed(() =>
  basket.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
)

/* ================= FILTERED PRODUCTS ================= */
const filteredProducts = computed(() => {
  if (!search.value) return products.value
  return products.value.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

/* ================= INITIAL DATA ================= */
// Filiallarni yuklash
const loadFilials = async () => {
  try {
    const res = await api.get('/filials')
    filials.value = res.data
  } catch (err) {
    console.error('Filials fetch error:', err)
  }
}
loadFilials()

/* ================= WATCH ================= */
// Filial o‘zgarganda mahsulotlarni backend’dan yuklash
watch(selectedFilial, async (filial) => {
  basket.value = []
  products.value = []
  search.value = ''
  if (!filial) return

  try {
    const res = await api.get('/transactions/products', { params: { filialId: filial._id } })
    products.value = res.data
  } catch (err) {
    console.error('Products fetch error:', err)
  }
})

// Dialog ochilganda reset
watch(visible, v => {
  if (v) reset()
})

/* ================= FUNCTIONS ================= */
const addToBasket = (product) => {
  const exist = basket.value.find(i => i.productId === product._id)
  if (exist) {
    exist.quantity++
  } else {
    basket.value.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1
    })
  }
  productDialog.value = false
}

const removeItem = (index) => basket.value.splice(index, 1)

const save = async () => {
  if (!props.user || !selectedFilial.value || basket.value.length === 0) return

  isLoading.value = true
  try {
    await api.post('/transactions/add', {
      userId: props.user._id,
      filialId: selectedFilial.value._id,
      items: basket.value.map(i => ({ productId: i.productId, quantity: i.quantity }))
    })

    emit('saved')
    visible.value = false
    reset()
  } catch (err) {
    console.error('Transaction error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  reset()
  visible.value = false
}

const reset = () => {
  selectedFilial.value = null
  basket.value = []
  products.value = []
  search.value = ''
}
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Balans qo‘shish" :style="{ width: '100%', maxWidth: '820px' }">
    <form @submit.prevent="save" class="space-y-6">
      <!-- FILIAL -->
      <div>
        <label class="block text-sm font-semibold mb-2">Filial</label>
        <Dropdown
          v-model="selectedFilial"
          :options="filials"
          optionLabel="name"
          placeholder="Filial tanlang"
          class="w-full"
        />
      </div>

      <!-- ADD PRODUCT -->
      <Button
        label="Mahsulot qo‘shish"
        icon="pi pi-plus"
        class="w-full"
        :disabled="!selectedFilial || products.length === 0"
        @click="productDialog = true"
      />

      <!-- BASKET -->
      <div v-if="basket.length" class="space-y-3">
        <div v-for="(item, i) in basket" :key="item.productId" class="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p class="font-semibold">{{ item.name }}</p>
            <p class="text-sm text-gray-500">{{ formatAmount(item.price) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <input type="number" min="1" v-model.number="item.quantity" class="w-20 px-2 py-1 border rounded" />
            <Button icon="pi pi-trash" severity="danger" text @click="removeItem(i)" />
          </div>
        </div>
      </div>

      <!-- TOTAL -->
      <div class="p-4 rounded-lg bg-blue-50 font-bold text-blue-900">
        Jami: {{ formatAmount(totalAmount) }}
      </div>

      <!-- ACTIONS -->
      <div class="flex gap-3 pt-4 border-t">
        <Button type="button" label="Bekor qilish" severity="secondary" class="flex-1" @click="handleCancel" />
        <Button type="submit" label="Saqlash" severity="success" class="flex-1" :loading="isLoading" :disabled="basket.length === 0" />
      </div>
    </form>
  </Dialog>

  <!-- PRODUCT SEARCH -->
  <Dialog v-model:visible="productDialog" modal header="Mahsulot tanlang" style="width: 600px">
    <InputText v-model="search" placeholder="Qidirish..." class="w-full mb-3" />
    <div class="max-h-96 overflow-y-auto">
      <div v-for="p in filteredProducts" :key="p._id" class="p-3 mb-2 border rounded cursor-pointer hover:bg-blue-50" @click="addToBasket(p)">
        <p class="font-semibold">{{ p.name }}</p>
        <p class="text-sm text-gray-600">{{ formatAmount(p.price) }}</p>
      </div>
    </div>
  </Dialog>
</template>
