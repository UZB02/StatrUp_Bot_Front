<script setup>
import { ref, computed, watch } from "vue";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import { useToast } from "primevue/usetoast";

import api from "@/utils/api";
import { formatCurrency } from "@/utils/formatCurrency";
import { useTransactionForm } from "@/composables/useTransactionForm";

const toast = useToast();
/* ========= Props & Emits ========= */
const props = defineProps({
  modelValue: Boolean,
  user: Object
});
const emit = defineEmits(["update:modelValue", "saved"]);

/* ========= Dialog visible ========= */
const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v)
});

/* ========= Form ========= */
const { filials, products, selectedFilial, reset } = useTransactionForm("spend");

/* ========= State ========= */
const productDialog = ref(false);
const search = ref("");
const isLoading = ref(false);

/* 🛒 BASKET */
const basket = ref([]);

/* ========= Filtered products ========= */
const filteredProducts = computed(() => {
  if (!selectedFilial.value) return [];
  if (!search.value) return products.value;
  return products.value.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

/* ========= Basket logic ========= */
const addToBasket = (product) => {
  const exist = basket.value.find(i => i.productId === product._id);
  if (exist) {
    exist.quantity++;
  } else {
    basket.value.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  productDialog.value = false;
};

const removeItem = (index) => basket.value.splice(index, 1);

/* ========= Totals ========= */
const totalAmount = computed(() =>
  basket.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
);

const remainingBalance = computed(() => {
  if (!props.user) return 0;
  return (props.user.balance || 0) - totalAmount.value;
});

const canSubmit = computed(() => {
  return (
    props.user &&
    selectedFilial.value &&
    basket.value.length > 0 &&
    remainingBalance.value >= 0
  );
});

/* ========= Reset on open ========= */
watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      reset();
      basket.value = [];
      search.value = "";
    }
  }
);

/* ========= Submit ========= */
const save = async () => {
  if (!canSubmit.value) return;

  isLoading.value = true;
  try {
    await api.post("/transactions/spend", {
      userId: props.user._id,
      filialId: selectedFilial.value._id,
      items: basket.value.map(i => ({
        productId: i.productId,
        quantity: i.quantity
      }))
    });

    emit("saved");
    visible.value = false;
    basket.value = [];
    reset();
  } catch (err){
    const audio = new Audio("/error.mp3"); 
    audio.play().catch(() => {});
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: `${err.response?.data?.message || err.message}`,
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = () => {
    visible.value = false;
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
        <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
          <i class="pi pi-receipt text-lg"></i>
        </div>
        <div>
          <h3 class="text-[14px] font-black text-slate-900 leading-none uppercase tracking-tighter">Balans sarflash</h3>
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Xarajat Terminali</p>
        </div>
      </div>
      
      <div v-if="user" class="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-100">
        <div class="text-right">
          <p class="text-[11px] font-black text-slate-700 leading-none">{{ user.fullname }}</p>
          <p class="text-[9px] font-bold text-rose-500 mt-1 uppercase">{{ user.autoNumber }}</p>
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
      <!-- CURRENT BALANCE MINI-CARD -->
      <div class="bg-slate-900 rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-lg relative overflow-hidden">
        <div class="absolute -left-10 -top-10 w-32 h-32 bg-rose-500 rounded-full blur-[60px] opacity-20"></div>
        <div>
           <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1.5">Mavjud Balans</p>
           <h2 class="text-xl md:text-2xl font-black text-white">{{ formatCurrency(user?.balance || 0) }}</h2>
        </div>
        <div class="bg-white/10 rounded-xl p-3 border border-white/5 backdrop-blur-sm">
           <i class="pi pi-wallet text-xl text-white/40"></i>
        </div>
      </div>

      <!-- FILIAL SELECTION -->
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <label class="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
          <i class="pi pi-map-marker text-[10px]"></i> Sotuv Filiali
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
          class="w-full py-6 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:border-rose-400 hover:bg-rose-50/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-rose-500 group-hover:bg-white transition-all shadow-sm">
            <i class="pi pi-plus text-base font-bold"></i>
          </div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Xizmat yoki mahsulot qo'shish</span>
        </button>
        <div v-if="!selectedFilial" class="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-2xl flex items-center justify-center pointer-events-none">
           <span class="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-tighter shadow-sm">Oldin filialni tanlang</span>
        </div>
      </div>

      <!-- BASKET ITEMS -->
      <div v-if="basket.length > 0" class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <h4 class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Xaridlar ({{ basket.length }})</h4>
          <button @click="basket = []" class="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline bg-transparent border-none cursor-pointer">Savatni tozalash</button>
        </div>

        <div class="space-y-1.5 font-sans">
          <div v-for="(item, i) in basket" :key="item.productId" 
            class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 md:gap-4 hover:border-rose-200 hover:shadow-sm transition-all"
          >
            <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 flex-shrink-0">
              {{ i + 1 }}
            </div>
            
            <div class="flex-1 min-w-0">
              <p class="text-[12px] font-black text-slate-800 leading-none truncate">{{ item.name }}</p>
              <div class="flex items-center gap-2 mt-1.5">
                <span class="text-[10px] font-bold text-rose-500">{{ formatCurrency(item.price) }}</span>
              </div>
            </div>

            <div class="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
               <InputNumber 
                v-model="item.quantity" 
                :min="0.1" :step="0.5" :minFractionDigits="1" showButtons 
                buttonLayout="horizontal"
                class="w-24 md:w-28 !h-7"
                inputClass="!w-full !p-0 !text-[11px] !font-black !text-center !bg-transparent !border-none"
                incrementButtonClass="!bg-transparent !border-none !text-slate-400 hover:!text-rose-500 !p-1"
                decrementButtonClass="!bg-transparent !border-none !text-slate-400 hover:!text-slate-600 !p-1"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
              />
            </div>

            <div class="hidden md:flex flex-col items-end min-w-[100px]">
               <span class="text-[11px] font-black text-slate-800">{{ formatCurrency(item.price * item.quantity) }}</span>
               <span class="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">Summa</span>
            </div>

            <button @click="removeItem(i)" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all border-none cursor-pointer flex items-center justify-center">
              <i class="pi pi-trash text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- EMPTY BASKET ILLUSTRATION -->
      <div v-else class="py-12 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-3xl opacity-50 border-dashed">
         <i class="pi pi-cart-plus text-4xl text-slate-200 mb-3"></i>
         <p class="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Savatda xaridlar yo'q</p>
      </div>

      <!-- CALCULATION INFO SECTION -->
      <div v-if="basket.length > 0" 
        :class="[
          'p-5 rounded-2xl border transition-all duration-300',
          remainingBalance >= 0 ? 'bg-white border-slate-200 shadow-sm' : 'bg-rose-50 border-rose-100'
        ]"
      >
        <div class="flex justify-between items-center mb-4">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jami Saralsh Summasi:</span>
          <span class="text-xl font-black text-rose-500">{{ formatCurrency(totalAmount) }}</span>
        </div>
        
        <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200">
          <div 
            class="h-full transition-all duration-700"
            :class="remainingBalance >= 0 ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-rose-500'"
            :style="{ width: Math.min((totalAmount / (user?.balance || 1)) * 100, 100) + '%' }"
          ></div>
        </div>

        <div class="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tranzaksiyadan keyingi qoldiq:</span>
          <div class="flex flex-col items-end">
             <span :class="['text-[14px] font-black', remainingBalance >= 0 ? 'text-slate-800' : 'text-rose-600']">
                {{ formatCurrency(remainingBalance) }}
             </span>
             <span v-if="remainingBalance < 0" class="text-[8px] font-black text-rose-500 uppercase mt-0.5 animate-pulse">Balance Yetarli emas!</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 💰 FOOTER ACTIONS -->
    <div class="bg-white border-t border-slate-200 p-4 sm:p-6 flex items-center gap-3 md:gap-4">
      <button 
        @click="handleCancel" 
        class="flex-1 py-3.5 md:py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-[11px] uppercase tracking-widest rounded-xl transition-all border-none cursor-pointer"
      >
        Bekor qilish
      </button>
      <button 
        @click="save"
        :disabled="!canSubmit || isLoading"
        class="flex-[2] py-3.5 md:py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-rose-500/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 border-none cursor-pointer flex items-center justify-center gap-2"
      >
        <i v-if="isLoading" class="pi pi-spin pi-spinner text-xs"></i>
        <span>Xaridni Tasdiqlash</span>
      </button>
    </div>
  </Dialog>

  <!-- MAHULOT TANLASH DIALOGI -->
  <Dialog 
    v-model:visible="productDialog" 
    modal 
    header="Xizmatni tanlang" 
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
          placeholder="QIDIRUV..." 
          class="!w-full !rounded-xl !bg-white !border-slate-200 !py-3 !pl-11 !text-[11px] !font-bold" 
        />
      </div>

      <div class="max-h-[350px] overflow-y-auto custom-scrollbar space-y-1.5 p-1">
        <div v-for="p in filteredProducts" :key="p._id" 
          @click="addToBasket(p)"
          class="flex items-center justify-between p-3 bg-white hover:bg-rose-50 border border-slate-100 hover:border-rose-200 rounded-xl cursor-pointer transition-all group"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-rose-500 group-hover:bg-white transition-all">
              <i class="pi pi-tag text-xs"></i>
            </div>
            <div>
              <p class="text-[11px] font-black text-slate-700 leading-none truncate max-w-[200px]">{{ p.name }}</p>
              <p class="text-[9px] font-bold text-rose-500 mt-1 uppercase">{{ formatCurrency(p.price) }}</p>
            </div>
          </div>
          <i class="pi pi-plus-circle text-lg text-slate-200 group-hover:text-rose-500 transition-colors"></i>
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
    name: 'SpendBalanceDialog'
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
