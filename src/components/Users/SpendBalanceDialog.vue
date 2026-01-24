<script setup>
import { ref, computed, watch } from "vue";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
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
       const audio = new Audio("../../../error.mp3"); // noto‘g‘ri scan uchun ovoz
    audio.play();
  toast.add({
  severity: "error",
  summary: "Xatolik",
  detail: `${err.response?.data?.message || err.message}`,
  life: 3000,
});
  }
  finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    :closable="false"
    class="w-[95vw] max-w-[550px] !rounded-[2.5rem] !overflow-hidden !border-none shadow-2xl"
  >
    <template #header>
      <div class="flex items-center gap-4 py-2">
        <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
          <i class="pi pi-shopping-cart text-xl"></i>
        </div>
        <div>
          <h3 class="text-xl font-black text-slate-900 leading-none">Balans sarflash</h3>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Foydalanuvchi hisobidan chiqarish</p>
        </div>
      </div>
    </template>

    <div class="space-y-6 pt-2">
      <div v-if="user" class="relative overflow-hidden p-5 rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-lg">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div class="relative flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Joriy Balans</p>
            <h2 class="text-2xl font-black text-emerald-400">{{ formatCurrency(user.balance || 0) }}</h2>
            <p class="text-xs font-bold text-slate-300 mt-2 flex items-center gap-2">
              <i class="pi pi-user text-[10px]"></i> {{ user.fullname }}
            </p>
          </div>
          <i class="pi pi-wallet text-4xl text-white/10"></i>
        </div>
      </div>

      <form @submit.prevent="save" class="space-y-5">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Filialni tanlang</label>
          <Dropdown
            v-model="selectedFilial"
            :options="filials"
            optionLabel="name"
            placeholder="Filialni tanlang"
            class="w-full !rounded-2xl !bg-slate-50 !border-none !py-1 focus:!ring-2 focus:!ring-rose-500/20"
          />
        </div>

        <Button
          label="Mahsulot qo‘shish"
          icon="pi pi-plus-circle"
          class="w-full !py-4 !rounded-2xl !bg-white !border-2 !border-dashed !border-slate-200 !text-slate-500 hover:!border-rose-400 hover:!text-rose-600 transition-all shadow-none font-bold"
          :disabled="!selectedFilial || products.length === 0"
          @click="productDialog = true"
        />

        <div v-if="basket.length" class="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
          <div v-for="(item, i) in basket" :key="item.productId" 
            class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group">
            
            <div class="flex-1">
              <p class="text-sm font-black text-slate-700 leading-tight">{{ item.name }}</p>
              <p class="text-[10px] font-bold text-slate-400">{{ formatCurrency(item.price) }}</p>
            </div>

            <div class="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm">
              <InputNumber 
                v-model="item.quantity" 
                :min="0.1" 
                :minFractionDigits="1"
                :step="0.5"
                class="w-24"
                inputClass="!w-6 !p-0 !text-center !bg-transparent !border-none !text-xs !font-black"
                showButtons
                buttonLayout="horizontal"
                incrementButtonIcon="pi pi-plus text-[8px]"
                decrementButtonIcon="pi pi-minus text-[8px]"
                incrementButtonClass="!p-1 !bg-transparent !border-none !text-slate-400"
                decrementButtonClass="!p-1 !bg-transparent !border-none !text-slate-400"
              />
            </div>

            <Button icon="pi pi-trash" severity="danger" text rounded class="!w-8 !h-8" @click="removeItem(i)" />
          </div>
        </div>

        <div v-if="basket.length" 
          :class="[
            'p-5 rounded-[2rem] border-2 transition-all duration-500',
            remainingBalance >= 0 ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50 border-rose-100'
          ]"
        >
          <div class="flex justify-between items-center mb-3">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jami sarf:</span>
            <span class="text-lg font-black text-slate-800">{{ formatCurrency(totalAmount) }}</span>
          </div>
          
          <div class="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-3">
            <div 
              class="h-full transition-all duration-1000"
              :class="remainingBalance >= 0 ? 'bg-emerald-500' : 'bg-rose-500'"
              :style="{ width: Math.min((totalAmount / (user.balance || 1)) * 100, 100) + '%' }"
            ></div>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qolgan balans:</span>
            <span :class="['text-sm font-black', remainingBalance >= 0 ? 'text-emerald-600' : 'text-rose-600']">
              {{ formatCurrency(remainingBalance) }}
            </span>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <Button 
            label="Bekor qilish" 
            text 
            class="flex-1 !py-4 !rounded-2xl !font-bold !text-slate-400" 
            @click="visible = false" 
          />
          <Button 
            label="Mablag'ni ayirish" 
            severity="danger" 
            class="flex-[2] !py-4 !rounded-2xl !bg-rose-600 !border-none !text-white !font-black shadow-lg shadow-rose-200 active:scale-95 transition-all"
            :loading="isLoading" 
            :disabled="!canSubmit || remainingBalance < 0" 
            @click="save" 
          />
        </div>
        <p v-if="remainingBalance < 0" class="text-center text-[10px] font-bold text-rose-500 uppercase tracking-tighter">
          <i class="pi pi-exclamation-triangle"></i> Hisobda mablag' yetarli emas!
        </p>
      </form>
    </div>
  </Dialog>

  <Dialog v-model:visible="productDialog" modal header="Mahsulot tanlash" class="w-[90vw] max-w-[500px] !rounded-[2.5rem]">
    <div class="space-y-4">
      <div class="relative group">
        <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <InputText v-model="search" placeholder="Qidirish..." class="w-full !rounded-2xl !bg-slate-50 !border-none !py-4 !pl-12 focus:!ring-2 focus:!ring-rose-500/10" />
      </div>
      
      <div class="max-h-80 overflow-y-auto custom-scrollbar space-y-2 pr-1">
        <div v-for="p in filteredProducts" :key="p._id" 
          class="p-4 rounded-2xl border border-slate-50 hover:bg-rose-50 hover:border-rose-100 cursor-pointer transition-all flex justify-between items-center group"
          @click="addToBasket(p)">
          <div>
            <p class="font-black text-slate-700">{{ p.name }}</p>
            <p class="text-xs font-bold text-emerald-500">{{ formatCurrency(p.price) }}</p>
          </div>
          <i class="pi pi-plus-circle text-slate-300 group-hover:text-rose-500 text-xl transition-colors"></i>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
:deep(.p-dialog-header) {
  padding: 1.5rem 2rem 1rem;
}
:deep(.p-dialog-content) {
  padding: 0 2rem 2rem;
}
</style>
