<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('close')"
    :modal="true"
    :closable="false"
    :draggable="false"
    class="w-full max-w-lg mx-3"
    :pt="{
      root: { class: 'border-none shadow-2xl overflow-hidden rounded-3xl' },
      header: { class: 'bg-slate-50 border-b border-slate-100 p-6' },
      content: { class: 'p-0' }
    }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div :class="editingProduct ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'" class="p-2.5 rounded-xl">
          <i :class="editingProduct ? 'pi pi-pencil' : 'pi pi-plus'" class="text-xl"></i>
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-800">
            {{ editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot' }}
          </h3>
          <p class="text-xs text-slate-500 font-medium">Ma'lumotlarni aniq kiriting</p>
        </div>
      </div>
    </template>

    <form @submit.prevent="onSubmit" class="p-6 space-y-5 bg-white">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div class="md:col-span-2 space-y-1.5">
          <label class="text-sm font-bold text-slate-700 ml-1">Mahsulot nomi</label>
          <InputText 
            v-model="form.name" 
            required 
            class="w-full !rounded-xl !border-slate-200 !bg-slate-50/50 focus:!bg-white transition-all hover:!border-blue-400"
            placeholder="Mahsulot nomi"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-bold text-slate-700 ml-1">Filial</label>
          <Select
            v-model="form.filial"
            :options="filials"
            option-label="name"
            option-value="_id"
            placeholder="Tanlang"
            required
            class="w-full !rounded-xl !border-slate-200 !bg-slate-50/50"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-bold text-slate-700 ml-1">Birlik</label>
          <Select
            v-model="form.unit"
            :options="units"
            option-label="label"
            option-value="value"
            placeholder="Tanlang"
            required
            class="w-full !rounded-xl !border-slate-200 !bg-slate-50/50"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-bold text-slate-700 ml-1">Miqdor</label>
          <InputNumber
            v-model="form.quantity"
            :min="0"
            :suffix="' ' + form.unit"
            :minFractionDigits="1"
            required
            class="w-full"
            input-class="!rounded-xl !border-slate-200 !bg-slate-50/50 w-full font-semibold"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-bold text-slate-700 ml-1">Narxi (1 {{ form.unit }} uchun)</label>
          <InputNumber
            v-model="form.price"
            :min="0"
            mode="currency"
            currency="UZS"
            locale="uz-UZ"
            required
            class="w-full"
            input-class="!rounded-xl !border-slate-200 !bg-slate-50/50 w-full font-bold text-blue-600"
          />
        </div>

        <div class="md:col-span-2 space-y-2 p-4 bg-rose-50/30 rounded-2xl border border-rose-100/50">
          <div class="flex justify-between items-center">
            <label class="text-sm font-bold text-slate-700">Chegirma miqdori</label>
            <div class="flex items-center gap-2">
               <span v-if="form.discount > 0" class="text-[10px] font-black uppercase text-rose-500 animate-pulse text-right">Aksiya faol</span>
               <InputNumber
                v-model="form.discount"
                :min="0"
                :max="100"
                :minFractionDigits="1"
                :maxFractionDigits="2"
                suffix=" %"
                input-class="w-20 !py-1 !px-2 !text-right !rounded-lg !border-rose-200 !text-sm font-bold !bg-white"
              />
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <input
              type="range"
              v-model.number="form.discount"
              min="0"
              max="100"
              step="0.1"
              class="flex-1 h-1.5 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>
          <p class="text-[10px] text-slate-400 italic font-medium">Slayderni suring yoki aniq qiymatni (masalan: 0.5) yozing</p>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button 
          label="Bekor qilish" 
          text 
          class="!text-slate-500 !font-bold hover:!bg-slate-100 !px-6 !py-3 !rounded-xl transition-all" 
          @click="$emit('close')"
        />
        <Button 
          :label="editingProduct ? 'Yangilash' : 'Saqlash'" 
          type="submit"
          :icon="editingProduct ? 'pi pi-refresh' : 'pi pi-check'"
          class="!bg-blue-600 hover:!bg-blue-700 !border-none !px-8 !py-3 !rounded-xl !shadow-lg !shadow-blue-200 transition-transform active:scale-95"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import Button from "primevue/button";

const props = defineProps({
  visible: Boolean,
  editingProduct: Object,
  filials: Array,
  units: Array
});

const emits = defineEmits(["save", "close"]);

const form = ref({
  name: "",
  filial: null,
  unit: "dona",
  price: 0,
  discount: 0,
  quantity: 0,
});

watch(
  () => props.editingProduct,
  (newVal) => {
    if (newVal) {
      form.value = {
        name: newVal.name,
        filial: newVal.filial._id,
        unit: newVal.unit,
        price: newVal.price,
        discount: newVal.discount,
        quantity: newVal.quantity,
      };
    } else {
      form.value = { name: "", filial: null, unit: "dona", price: 0, discount: 0 };
    }
  },
  { immediate: true }
);

const onSubmit = () => {
  emits("save", { ...form.value });
};
</script>
