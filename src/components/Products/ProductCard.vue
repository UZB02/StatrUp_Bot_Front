<template>
  <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <!-- Background accent -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-emerald-50/0 group-hover:from-blue-50/50 group-hover:to-emerald-50/30 transition-all duration-300"></div>
    
    <div class="relative p-6 space-y-4">
      <!-- Header with status badge -->
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
            {{ product.name }}
          </h3>
          <p class="text-sm text-slate-500 mt-1 line-clamp-1">{{ product.filial?.name }}</p>
        </div>
        <Tag
          :value="product.isActive ? 'Faol' : 'Nofaol'"
          :severity="product.isActive ? 'success' : 'danger'"
          class="whitespace-nowrap"
        />
      </div>

      <!-- Product details grid -->
      <div class="grid grid-cols-2 gap-4 py-2">
        <div class="space-y-1">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Miqdor</p>
          <p class="text-sm font-semibold text-slate-900">{{ product.quantity }} {{ product.unit }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Narx</p>
          <p class="text-sm font-semibold text-slate-900">{{ formatCurrency(product.price) }} / {{ product.unit }}</p>
        </div>
      </div>
     <div class="space-y-1">
       <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Holat</p>
       <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  :class="product.quantity <100 ? `bg-gradient-to-r from-red-600 to-red-400 h-2 rounded-full` : `bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full`" 
                  :style="{ width: `${Math.min((product.quantity / 1000) * 100, 100)}%` }"
                ></div>
              </div>
     </div>
      <!-- Discount highlight -->
      <div v-if="product.discount > 0" class="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
        <span class="inline-flex items-center justify-center w-auto p-2 h-6 bg-red-500 text-white text-xs font-bold rounded">
          {{ product.discount }}%
        </span>
        <span class="text-sm font-medium text-slate-700">Chegirma</span>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-2 pt-2 border-t border-slate-200">
        <Button
          icon="pi pi-pencil"
          label="Tahrirlash"
          class="flex-1 p-button-sm p-button-outlined"
          severity="warning"
          @click="$emit('edit', product)"
        />
        <Button
          icon="pi pi-trash"
          class="p-button-sm p-button-outlined p-button-danger"
          @click="$emit('delete', product._id)"
          v-tooltip.top="'O\'chirish'"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import Tag from "primevue/tag";
import { defineProps, defineEmits } from "vue";
import { formatCurrency } from "@/utils/formatCurrency.js"

const props = defineProps({
  product: Object
});

const emits = defineEmits(["edit", "delete"]);

</script>