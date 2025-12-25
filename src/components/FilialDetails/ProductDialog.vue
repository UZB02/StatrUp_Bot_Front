<template>
  <Dialog
    :header="product ? 'Productni tahrirlash' : 'Yangi Product'"
    :visible="visible"
    modal
    class="w-full max-w-md"
    :closable="false"
    @update:visible="onVisibleChange"
  >
    <!-- <CHANGE> Enhanced form layout with better spacing and visual hierarchy -->
    <form @submit.prevent="save" class="space-y-5">
      <!-- Header section with green accent -->
      <div class="pb-4 border-b border-green-100">
        <p class="text-sm text-gray-500">
          {{ product ? 'Mavjud mahsulotni tahrirlang' : 'Yangi mahsulot qo\'shing' }} 
        </p>
      </div>

      <!-- Product Name -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700">
          Nomi
          <span class="text-red-500">*</span>
        </label>
        <InputText 
          v-model="form.name" 
          class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          placeholder="Product nomi kiriting..."
          required 
        />
      </div>

      <!-- Unit Selection -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700">
          Birlik
          <span class="text-red-500">*</span>
        </label>
        <Select
          v-model="form.unit"
          :options="units"
          optionLabel="label"
          optionValue="value"
          placeholder="Birlik tanlang"
          class="w-full"
          required
        />
      </div>

      <!-- Quantity -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700">
          Miqdor
        </label>
        <InputNumber 
          v-model="form.quantity" 
          :min="0" 
          class="w-full"
          placeholder="0"
        />
      </div>

      <!-- Price -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700">
          Narx (1 {{ form.unit }})
          <span class="text-red-500">*</span>
        </label>
     <InputNumber
  v-model="form.price"
  mode="currency"
  currency="UZS"
  locale="uz-UZ"
  class="w-full"
  placeholder="0"
  required
/>

      </div>

      <!-- Discount -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700">
          Chegirma (%)
        </label>
        <div class="relative">
          <InputNumber
            v-model="form.discount"
            :min="0"
            :max="100"
            class="w-full"
            placeholder="0"
          />
          <span class="absolute right-3 top-2.5 text-sm font-medium text-gray-500">%</span>
        </div>
      </div>

      <!-- <CHANGE> Enhanced button styling with green primary and improved spacing -->
      <div class="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <Button
          label="Bekor qilish"
          severity="secondary"
          type="button"
          class="px-4 py-2"
          @click="close"
        />
        <Button 
          label="Saqlash" 
          type="submit"
          class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
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