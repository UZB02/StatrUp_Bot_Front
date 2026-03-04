<script setup>
import { computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
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
    const audio = new Audio("/error.mp3"); 
    audio.play().catch(() => {});
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: `${err.response?.data?.message || err.message}`,
      life: 3000,
    });
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
    class="w-[95vw] lg:w-[85vw] max-w-[800px] !rounded-3xl !overflow-hidden !border-none shadow-2xl"
    :pt="{
      header: { class: '!hidden' },
      content: { class: '!p-0 !bg-slate-50' }
    }"
  >
    <!-- 🏢 POS MODAL HEADER -->
    <div class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
          <i class="pi pi-briefcase text-lg"></i>
        </div>
        <div>
          <h3 class="text-[14px] font-black text-slate-900 leading-none uppercase tracking-tighter">Balansni to'ldirish</h3>
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Tranzaksiya Terminali</p>
        </div>
      </div>
      
      <div v-if="user" class="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-100">
        <div class="text-right">
          <p class="text-[11px] font-black text-slate-700 leading-none">{{ user.fullname }}</p>
          <p class="text-[9px] font-bold text-blue-500 mt-1 uppercase">{{ user.autoNumber }}</p>
        </div>
        <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200 uppercase">
          {{ user.fullname?.charAt(0) }}
        </div>
      </div>
      
      <button @click="handleCancel" class="sm:hidden w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center border-none">
        <i class="pi pi-times text-xs"></i>
      </button>
    </div>

    <!-- 📥 MAIN CONTENT -->
    <div class="p-4 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
      <!-- FILIAL SELECTION -->
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <label class="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
          <i class="pi pi-map-marker text-[10px]"></i> Qabul qiluvchi filial
        </label>
        <Dropdown
          v-model="selectedFilial"
          :options="filials"
          optionLabel="name"
          placeholder="FILIALNI TANLANG"
          class="!w-full !rounded-xl !bg-slate-50 !border-slate-100 !py-0.5"
          :pt="{
            label: { class: '!text-[11px] !font-black !text-slate-700 !uppercase !tracking-wider' },
            item: { class: '!text-[11px] !font-bold !py-2.5 !px-4' }
          }"
        />
      </div>

      <!-- PRODUCT ADD BUTTON -->
      <div class="relative group">
        <button
          @click="productDialog = true"
          :disabled="!selectedFilial"
          class="w-full py-6 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:border-blue-400 hover:bg-blue-50/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-white transition-all shadow-sm">
            <i class="pi pi-plus text-base font-bold"></i>
          </div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mahsulotlarni qo'shish</span>
        </button>
        <div v-if="!selectedFilial" class="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-2xl flex items-center justify-center pointer-events-none">
           <span class="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-tighter shadow-sm">Oldin filialni tanlang</span>
        </div>
      </div>

      <!-- BASKET ITEMS -->
      <div v-if="basket.length > 0" class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <h4 class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Savatdagi mahsulotlar ({{ basket.length }})</h4>
          <button @click="basket = []" class="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline bg-transparent border-none cursor-pointer">Hammasini tozalash</button>
        </div>

        <div class="space-y-1.5 font-sans">
          <div v-for="(item, i) in basket" :key="item.productId" 
            class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 md:gap-4 hover:border-blue-200 hover:shadow-sm transition-all"
          >
            <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 flex-shrink-0">
              {{ i + 1 }}
            </div>
            
            <div class="flex-1 min-w-0">
              <p class="text-[12px] font-black text-slate-800 leading-none truncate">{{ item.name }}</p>
              <div class="flex items-center gap-2 mt-1.5">
                <span class="text-[10px] font-bold text-blue-600">{{ formatAmount(item.price) }}</span>
                <span class="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Donasi</span>
              </div>
            </div>

            <div class="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
               <InputNumber 
                v-model="item.quantity" 
                :min="0.1" :step="0.1" :minFractionDigits="1" showButtons 
                buttonLayout="horizontal"
                class="w-24 md:w-28 !h-7"
                inputClass="!w-full !p-0 !text-[11px] !font-black !text-center !bg-transparent !border-none"
                incrementButtonClass="!bg-transparent !border-none !text-slate-400 hover:!text-blue-500 !p-1"
                decrementButtonClass="!bg-transparent !border-none !text-slate-400 hover:!text-rose-500 !p-1"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
              />
            </div>

            <div class="hidden md:flex flex-col items-end min-w-[100px]">
               <span class="text-[11px] font-black text-slate-800">{{ formatAmount(item.price * item.quantity) }}</span>
               <span class="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">Jami</span>
            </div>

            <button @click="removeItem(i)" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all border-none cursor-pointer flex items-center justify-center">
              <i class="pi pi-trash text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- EMPTY BASKET ILLUSTRATION -->
      <div v-else class="py-12 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-3xl opacity-50 border-dashed">
         <i class="pi pi-shopping-bag text-4xl text-slate-200 mb-3"></i>
         <p class="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Savat hozircha bo'sh</p>
      </div>
    </div>

    <!-- 💰 TOTAL ACCOUNT & FOOTER -->
    <div class="bg-white border-t border-slate-200 p-4 sm:p-6 space-y-4">
      <div class="bg-slate-900 rounded-2xl p-5 md:p-6 flex items-center justify-between shadow-xl relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-10"></div>
        
        <div>
          <p class="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1.5">Tranzaksiya Summasi</p>
          <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">{{ formatAmount(totalAmount) }}</h2>
        </div>
        
        <div class="flex items-center gap-6">
          <div class="hidden sm:block text-right border-r border-slate-700 pr-6">
            <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Status</p>
            <p class="text-[11px] font-bold text-blue-400 uppercase">{{ basket.length }} turdagi tovar</p>
          </div>
          <div class="flex flex-col items-end">
             <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50"></div>
             <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2">Ready</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3 md:gap-4">
        <button 
          @click="handleCancel" 
          class="flex-1 py-3.5 md:py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-[11px] uppercase tracking-widest rounded-xl transition-all border-none cursor-pointer"
        >
          Bekor qilish
        </button>
        <button 
          @click="save"
          :disabled="basket.length === 0 || isLoading"
          class="flex-[2] py-3.5 md:py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 border-none cursor-pointer flex items-center justify-center gap-2"
        >
          <i v-if="isLoading" class="pi pi-spin pi-spinner text-xs"></i>
          <span>Tasdiqlash va Saqlash</span>
        </button>
      </div>
    </div>
  </Dialog>

  <!-- MAHULOT TANLASH DIALOGI -->
  <Dialog 
    v-model:visible="productDialog" 
    modal 
    header="Mahsulotni tanlang" 
    class="w-[90vw] max-w-[500px] !rounded-3xl !border-none !shadow-2xl"
    :pt="{
      header: { class: '!p-5 !bg-white border-b border-slate-100' },
      headerTitle: { class: '!text-[13px] !font-black !text-slate-800 !uppercase !tracking-widest' },
      content: { class: '!p-3 !bg-slate-50' }
    }"
  >
    <div class="flex flex-col gap-3">
      <div class="relative">
        <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
        <InputText 
          v-model="search" 
          placeholder="MAHSULOT NOMI..." 
          class="!w-full !rounded-xl !bg-white !border-slate-200 !py-3 !pl-11 !text-[11px] !font-bold" 
        />
      </div>

      <div class="max-h-[350px] overflow-y-auto custom-scrollbar space-y-1.5 p-1">
        <div v-for="p in filteredProducts" :key="p._id" 
          @click="addToBasket(p)"
          class="flex items-center justify-between p-3 bg-white hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-xl cursor-pointer transition-all group"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-white transition-all">
              <i class="pi pi-box text-xs"></i>
            </div>
            <div>
              <p class="text-[11px] font-black text-slate-700 leading-none truncate max-w-[200px]">{{ p.name }}</p>
              <p class="text-[9px] font-bold text-emerald-500 mt-1 uppercase">{{ formatAmount(p.price) }}</p>
            </div>
          </div>
          <i class="pi pi-plus-circle text-lg text-slate-200 group-hover:text-blue-500 transition-colors"></i>
        </div>

        <div v-if="filteredProducts.length === 0" class="text-center py-10">
          <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Hech narsa topilmadi</p>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>
export default {
    name: 'AddBalanceDialog'
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

:deep(.p-inputnumber-input) {
  padding: 0 !important;
}
</style>
