<template>
  <div class="border rounded-lg p-4 shadow hover:shadow-lg transition duration-200">
    <h3 class="text-lg font-semibold mb-2">{{ product.name }}</h3>
    <p class="text-sm text-gray-500 mb-1">Filial: {{ product.filial.name }}</p>
    <p class="text-sm text-gray-500 mb-1">Birlik: {{ product.unit }}</p>
    <p class="text-sm text-gray-500 mb-1">Narx: {{ formatPrice(product.price, product.unit) }}</p>
    <p class="text-sm text-gray-500 mb-1">Chegirma: {{ product.discount }}%</p>
    <Tag
      :value="product.isActive ? 'Faol' : 'Nofaol'"
      :severity="product.isActive ? 'success' : 'danger'"
      class="mb-2"
    />
    <div class="flex justify-end gap-2 mt-2">
      <Button icon="pi pi-pencil" class="p-button-sm p-button-warning" @click="$emit('edit', product)" />
      <Button icon="pi pi-trash" class="p-button-sm p-button-danger" @click="$emit('delete', product._id)" />
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import Tag from "primevue/tag";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  product: Object
});

const emits = defineEmits(["edit", "delete"]);

const formatPrice = (price, unit) => {
  return `$${price.toFixed(2)} / ${unit === "dona" ? "dona" : "1 litr"}`;
};
</script>

<style scoped></style>
