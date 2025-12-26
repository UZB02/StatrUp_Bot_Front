<template>
  <Dialog
    :header="editingProduct ? 'Productni tahrirlash' : 'Yangi Product'"
    :visible="visible"
    @update:visible="$emit('close')"
    :modal="true"
    :closable="false"
    class="w-full max-w-md"
    :style="{ borderRadius: '12px' }"
  >
    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Product Name Field -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-900">Mahsulot nomi</label>
        <InputText 
          v-model="form.name" 
          required 
          class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Mahsulot nomini kiriting"
        />
      </div>

      <!-- Branch Field -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-900">Filial</label>
        <Select
          v-model="form.filial"
          :options="filials"
          option-label="name"
          option-value="_id"
          placeholder="Filialni tanlang"
          required
          class="w-full"
          :class="{ 'p-inputtext-sm': true }"
        />
      </div>

      <!-- Unit Field -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-900">Birlik</label>
        <Select
          v-model="form.unit"
          :options="units"
          option-label="label"
          option-value="value"
          placeholder="Birlini tanlang"
          required
          class="w-full"
        />
      </div>

      <!-- Quantity  -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-900">
          Miqdor
        </label>
        <InputNumber
          v-model="form.quantity"
          :min="0"
          :suffix="` `+ form.unit"
          required
          class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          input-class="bg-gray-50 text-gray-900"
        />
      </div>
      <!-- Price Field -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-900">
          Narx
          <span class="font-normal text-gray-600 text-xs ml-1">({{ form.unit === 'dona' ? '1 dona' : form.unit === 'litr' ? '1 litr' : '1 kg' }} uchun)</span>
        </label>
        <InputNumber
          v-model="form.price"
          :min="0"
          suffix=" UZS"
          required
          class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          input-class="bg-gray-50 text-gray-900"
        />
      </div>

      <!-- Discount Field -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-900">Chegirma</label>
        <div class="relative">
       <input
  type="number"
  v-model.number="form.discount"  
  min="0"
  max="100"
  step="0.1"                    
  placeholder="Discount (%)"
  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
/>

        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
        <Button 
          label="Bekor qilish" 
          class="p-button-text text-gray-700 hover:bg-gray-100" 
          @click="$emit('close')"
          severity="secondary"
        />
        <Button 
          label="Saqlash" 
          type="submit"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          severity="primary"
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
