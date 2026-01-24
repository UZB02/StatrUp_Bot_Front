<template>
  <Dialog
    :visible="visible"
    modal
    :closable="false"
    @update:visible="onVisibleChange"
    class="w-[95vw] max-w-lg !rounded-[2.5rem] !overflow-hidden !border-none"
  >
    <template #header>
      <div class="flex items-center gap-4 py-2">
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
          <i :class="['pi text-xl', product ? 'pi-pencil' : 'pi-plus']"></i>
        </div>
        <div>
          <h3 class="text-xl font-black text-slate-900 leading-none">
            {{ product ? 'Mahsulotni tahrirlash' : 'Yangi Mahsulot' }}
          </h3>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            {{ product ? 'ID: #' + product._id.slice(-6) : 'Omborga qo\'shish' }}
          </p>
        </div>
      </div>
    </template>

    <form @submit.prevent="save" class="space-y-6 pt-2">
      <div class="space-y-2 group">
        <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-emerald-500 transition-colors">
          <i class="pi pi-tag text-[10px]"></i>
          Mahsulot Nomi <span class="text-rose-500">*</span>
        </label>
        <InputText 
          v-model="form.name" 
          placeholder="Masalan: Maxsus Armatura"
          required 
          class="w-full !rounded-2xl !bg-slate-50 !border-none !py-4 !px-5 focus:!ring-2 focus:!ring-emerald-500/20 transition-all"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            <i class="pi pi-box text-[10px]"></i>
            Birlik <span class="text-rose-500">*</span>
          </label>
          <Select
            v-model="form.unit"
            :options="units"
            optionLabel="label"
            optionValue="value"
            placeholder="Tanlang"
            class="w-full !rounded-2xl !bg-slate-50 !border-none !py-1"
          />
        </div>
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            <i class="pi pi-chart-line text-[10px]"></i>
            Miqdor
          </label>
          <InputNumber 
            v-model="form.quantity" 
            :min="0" 
            placeholder="0.00"
            class="w-full !rounded-2xl !bg-slate-50 !border-none overflow-hidden"
            inputClass="!bg-transparent !border-none !py-4 !px-5 w-full"
          />
        </div>
      </div>

      <div class="bg-slate-50/80 p-6 rounded-[2rem] space-y-5 border border-slate-100">
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">
            <i class="pi pi-money-bill text-[10px]"></i>
            Narxi (1 {{ form.unit || 'birlik' }} uchun)
          </label>
          <InputNumber
            v-model="form.price"
            mode="currency"
            currency="UZS"
            locale="uz-UZ"
            placeholder="0.00 UZS"
            required
            class="w-full !rounded-xl !bg-white !border-slate-200 overflow-hidden shadow-sm"
            inputClass="!bg-transparent !border-none !py-4 !px-5 w-full font-black text-slate-700"
          />
        </div>

       <div class="space-y-4">
  <label class="flex items-center justify-between text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] ml-1">
    <span class="flex items-center gap-2">
      <i class="pi pi-percentage text-[10px]"></i> 
      Chegirma miqdori
    </span>
    <span class="text-sm font-black bg-orange-100 px-2 py-0.5 rounded-lg">
      {{ form.discount || 0 }}%
    </span>
  </label>

  <div class="flex items-center gap-4">
    <Slider 
      v-model="form.discount" 
      :min="0" 
      :max="100" 
      :step="0.1" 
      class="flex-1 !h-1.5" 
    />
    
    <InputNumber
      v-model="form.discount"
      :min="0"
      :max="100"
      :minFractionDigits="1"
      :maxFractionDigits="2"
      suffix="%"
      class="w-24 overflow-hidden !rounded-xl"
      inputClass="!py-2 !px-3 !text-xs !font-bold !bg-slate-100 !border-none text-center"
    />
  </div>
  
  <p class="text-[9px] text-slate-400 italic ml-1">
    * Masalan: 0.2% yoki 0.5% kabi kichik qiymatlarni ham kiritishingiz mumkin.
  </p>
</div>
      </div>

      <div class="flex items-center gap-3 pt-4">
        <Button
          label="Bekor qilish"
          text
          type="button"
          class="flex-1 !py-4 !rounded-2xl !text-slate-400 !font-bold hover:!bg-slate-100 transition-all"
          @click="close"
        />
        <Button 
          label="Saqlash" 
          type="submit"
          class="flex-[2] !py-4 !rounded-2xl !bg-emerald-600 !border-none !text-white !font-black !shadow-lg !shadow-emerald-200 hover:!scale-[1.02] active:!scale-95 transition-all"
        />
      </div>
    </form>
  </Dialog>
</template>
<script setup>
import { ref, watch } from "vue";
import api from "@/utils/api";

/* PrimeVue */
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import Button from "primevue/button";
import Slider from 'primevue/slider';
/* Props */
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  product: {
    type: Object,
    default: null
  },
  filialId: {
    type: String,
    required: true
  }
});

/* Emits */
const emit = defineEmits(["update:visible", "saved"]);

/* Units */
const units = [
  { label: "Dona", value: "dona" },
  { label: "Litr", value: "litr" },
  { label: "Kg", value: "kg" }
];

/* Form */
const form = ref({
  name: "",
  unit: "dona",
  quantity: 0,
  price: 0,
  discount: 0
});

/* Reset form */
const reset = () => {
  form.value = {
    name: "",
    unit: "dona",
    quantity: 0,
    price: 0,
    discount: 0
  };
};

/* Watch product changes */
watch(
  () => props.product,
  (val) => {
    if (val) {
      form.value = {
        name: val.name ?? "",
        unit: val.unit ?? "dona",
        quantity: val.quantity ?? 0,
        price: val.price ?? 0,
        discount: val.discount ?? 0
      };
    } else {
      reset();
    }
  },
  { immediate: true }
);

/* Save product */
const save = async () => {
  try {
    const payload = {
      ...form.value,
      filial: props.filialId
    };

    if (props.product?._id) {
      await api.put(`/products/${props.product._id}`, payload);
    } else {
      await api.post("/products", payload);
    }

    emit("saved");
    close();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Xatolik yuz berdi");
  }
};

/* Close dialog */
const close = () => {
  emit("update:visible", false);
  reset();
};

/* Handle dialog visibility */
const onVisibleChange = (val) => {
  if (!val) close();
  else emit("update:visible", val);
};
</script>
<style scoped>
:deep(.p-dialog-header) {
  padding: 2rem 2rem 1rem;
  background: white;
}

:deep(.p-dialog-content) {
  padding: 0 2rem 2rem;
  background: white;
}

/* InputNumber ichki qismlarini to'g'irlash */
:deep(.p-inputnumber-input) {
  width: 100%;
}

/* Slider Emerald rangda bo'lishi uchun */
:deep(.p-slider .p-slider-range) {
  background: #10b981;
}

:deep(.p-slider .p-slider-handle) {
  border: 3px solid #10b981;
  background: white;
}
</style>