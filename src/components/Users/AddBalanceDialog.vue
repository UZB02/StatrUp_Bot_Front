<script setup>
import { computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useToast } from "primevue/usetoast";
import api from '@/utils/api'

/* ================= STATE ================= */
const filials = ref([])
const products = ref([])
const selectedFilial = ref(null)
const basket = ref([])
const search = ref('')
const productDialog = ref(false)
const isLoading = ref(false)
const toast = useToast();
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
       const audio = new Audio("../../../error.mp3"); // noto‘g‘ri scan uchun ovoz
    audio.play();
  toast.add({
  severity: "error",
  summary: "Xatolik",
  detail: `${err.response?.data?.message || err.message}`,
  life: 3000,
});
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
  <Dialog 
    v-model:visible="visible" 
    modal 
    :closable="false"
    class="w-[95vw] max-w-[820px] !rounded-[2.5rem] !overflow-hidden !border-none shadow-2xl"
  >
    <template #header>
      <div class="flex items-center gap-4 py-2">
        <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
          <i class="pi pi-wallet text-xl"></i>
        </div>
        <div>
          <h3 class="text-xl font-black text-slate-900 leading-none">Balansni to‘ldirish</h3>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Omborga mahsulot kirim qilish</p>
        </div>
      </div>
    </template>

    <form @submit.prevent="save" class="space-y-8 pt-2">
      <div class="space-y-3 group">
        <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-500 transition-colors">
          <i class="pi pi-building text-[10px]"></i> Qabul qiluvchi filial
        </label>
        <Dropdown
          v-model="selectedFilial"
          :options="filials"
          optionLabel="name"
          placeholder="Filialni tanlang"
          class="w-full !rounded-2xl !bg-slate-50 !border-none !py-1 focus:!ring-2 focus:!ring-blue-500/20"
        />
      </div>

      <div class="relative">
        <Button
          label="Mahsulotlarni tanlash"
          icon="pi pi-search-plus"
          class="w-full !py-6 !rounded-[2rem] !bg-white !border-2 !border-dashed !border-slate-200 !text-slate-500 hover:!border-blue-400 hover:!text-blue-600 hover:!bg-blue-50/30 transition-all !shadow-none font-bold"
          :disabled="!selectedFilial || products.length === 0"
          @click="productDialog = true"
        />
        <div v-if="!selectedFilial" class="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-[2rem] flex items-center justify-center cursor-not-allowed">
           <span class="text-[10px] font-black uppercase text-slate-400 tracking-tighter bg-white px-3 py-1 rounded-full shadow-sm">Oldin filialni tanlang</span>
        </div>
      </div>

      <div v-if="basket.length" class="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        <div class="flex items-center justify-between px-2">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Savatdagi mahsulotlar ({{ basket.length }})</span>
          <Button label="Tozalash" icon="pi pi-refresh" text size="small" class="!text-[10px] !font-bold !text-rose-500" @click="basket = []" />
        </div>

        <div v-for="(item, i) in basket" :key="item.productId" 
          class="group/item flex items-center gap-4 p-4 bg-white rounded-[1.5rem] border border-slate-100 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50/50 transition-all duration-300">
          
          <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-xs group-hover/item:bg-blue-500 group-hover/item:text-white transition-colors">
            {{ i + 1 }}
          </div>

          <div class="flex-1">
            <p class="font-black text-slate-800 leading-tight">{{ item.name }}</p>
            <p class="text-xs font-bold text-emerald-600 mt-1">
              {{ formatAmount(item.price) }} 
              <span class="text-slate-400 font-medium">/ 1 {{ item.unit || 'birlik' }}</span>
            </p>
          </div>

          <div class="flex flex-col items-end gap-1">
            <div class="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100 focus-within:border-blue-300 transition-all">
              <InputNumber 
                v-model="item.quantity" 
                :min="0.1"
                :step="0.1"
                :minFractionDigits="1"
                :maxFractionDigits="3"
                showButtons 
                buttonLayout="horizontal" 
                class="w-36 custom-number-input"
                inputClass="!w-16 !p-0 !text-center !bg-transparent !border-none !font-black !text-slate-700"
                incrementButtonClass="!bg-transparent !border-none !text-slate-400 hover:!text-blue-600"
                decrementButtonClass="!bg-transparent !border-none !text-slate-400 hover:!text-rose-600"
                incrementButtonIcon="pi pi-plus-circle"
                decrementButtonIcon="pi pi-minus-circle"
              />
            </div>
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mr-2 italic">
              Jami: {{ formatAmount(item.price * item.quantity) }}
            </span>
          </div>

          <Button 
            icon="pi pi-trash" 
            severity="danger" 
            text 
            rounded
            class="hover:!bg-rose-50 !w-10 !h-10" 
            @click="removeItem(i)" 
          />
        </div>
      </div>

      <div class="relative overflow-hidden p-6 rounded-[2rem] bg-slate-900 text-white shadow-xl shadow-slate-200">
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-blue-500 rounded-full blur-[60px] opacity-20"></div>
        <div class="relative flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Umumiy hisob</p>
            <h2 class="text-3xl font-black tracking-tighter">{{ formatAmount(totalAmount) }}</h2>
          </div>
          <div class="h-12 w-px bg-slate-700 mx-6 hidden md:block"></div>
          <div class="hidden md:block">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Elementlar</p>
            <p class="text-xl font-black text-blue-400">{{ basket.length }} turda</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4 pt-4 border-t border-slate-100">
        <Button 
          type="button" 
          label="Bekor qilish" 
          text
          class="flex-1 !py-4 !rounded-2xl !font-bold !text-slate-400 hover:!bg-slate-100 transition-all" 
          @click="handleCancel" 
        />
        <Button 
          type="submit" 
          label="Saqlash va Tasdiqlash" 
          class="flex-[2] !py-4 !rounded-2xl !bg-emerald-600 !border-none !text-white !font-black !shadow-lg !shadow-emerald-200 hover:!scale-[1.02] active:!scale-95 transition-all"
          :loading="isLoading" 
          :disabled="basket.length === 0" 
        />
      </div>
    </form>
  </Dialog>

  <Dialog 
    v-model:visible="productDialog" 
    modal 
    header="Mahsulotlarni qidirish" 
    class="w-[90vw] max-w-[600px] !rounded-[2.5rem]"
  >
    <div class="space-y-4">
      <div class="relative group">
        <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <InputText 
          v-model="search" 
          placeholder="Mahsulot nomi bo‘yicha filtr..." 
          class="w-full !rounded-2xl !bg-slate-50 !border-none !py-4 !pl-12 focus:!ring-2 focus:!ring-blue-500/10" 
        />
      </div>

      <div class="max-h-96 overflow-y-auto pr-2 custom-scrollbar space-y-2">
        <div v-for="p in filteredProducts" :key="p._id" 
          @click="addToBasket(p)"
          class="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-blue-50 hover:border-blue-100 cursor-pointer transition-all group"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors border border-slate-100">
              <i class="pi pi-box"></i>
            </div>
            <div>
              <p class="font-bold text-slate-700 leading-none mb-1">{{ p.name }}</p>
              <p class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{{ formatAmount(p.price) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
             <span class="text-[10px] font-bold text-slate-300 group-hover:text-blue-400 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Savatga qo'shish</span>
             <i class="pi pi-plus-circle text-slate-200 group-hover:text-blue-500 transition-colors text-xl"></i>
          </div>
        </div>

        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <i class="pi pi-search-minus text-4xl text-slate-200 mb-3"></i>
          <p class="text-slate-400 font-bold tracking-tight">Qidiruv bo'yicha hech narsa topilmadi</p>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
/* Scrollbar styling */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

/* Dialog and inputs */
:deep(.p-dialog-header) {
  padding: 2rem 2rem 1rem;
  background: white;
}
:deep(.p-dialog-content) {
  padding: 0 2rem 2rem;
  background: white;
}
:deep(.custom-number-input .p-inputnumber-button) {
  width: 2.2rem;
}
:deep(.p-inputnumber-input) {
  font-family: inherit;
}
</style>
