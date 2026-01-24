<template>
  <div class="group relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
    <div class="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div class="relative p-5 space-y-5">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2 h-2 rounded-full" :class="product.isActive ? 'bg-emerald-500' : 'bg-rose-500'"></span>
            <p class="text-xs font-medium text-slate-400 uppercase tracking-widest">{{ product.filial?.name || 'Asosiy filial' }}</p>
          </div>
          <h3 class="text-lg font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors duration-300">
            {{ product.name }}
          </h3>
        </div>
        <Tag
          :value="product.isActive ? 'Faol' : 'Nofaol'"
          :severity="product.isActive ? 'success' : 'danger'"
          class="!rounded-full !px-3 !text-[10px] !font-bold uppercase tracking-tighter"
        />
      </div>

      <div class="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
        <div class="space-y-0.5">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Omborda</p>
          <p class="text-sm font-bold text-slate-700">{{ product.quantity }} <span class="text-slate-400 font-medium">{{ product.unit }}</span></p>
        </div>
        <div class="space-y-0.5">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Narxi</p>
          <p class="text-sm font-bold text-blue-600">{{ formatCurrency(product.price) }}</p>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between items-center text-[11px] font-bold">
          <span class="text-slate-500 uppercase">Zaxira holati</span>
          <span :class="product.quantity < 100 ? 'text-rose-500' : 'text-emerald-500'">
            {{ Math.min(((product.quantity / 1000) * 100).toFixed(0), 100) }}%
          </span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div 
            class="h-full transition-all duration-700 ease-out rounded-full"
            :class="product.quantity < 100 ? 'bg-gradient-to-r from-rose-500 to-orange-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'" 
            :style="{ width: `${Math.min((product.quantity / 1000) * 100, 100)}%` }"
          ></div>
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 pt-2">
        <div v-if="product.discount > 0" class="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
          <i class="pi pi-percentage text-[10px] font-bold"></i>
          <span class="text-xs font-black">{{ product.discount }}</span>
        </div>
        <div v-else class="h-[26px]"></div> <div class="flex gap-2">
          <Button
            icon="pi pi-pencil"
            text
            rounded
            severity="secondary"
            class="!h-9 !w-9 hover:!bg-blue-50 hover:!text-blue-600 transition-colors"
            @click="$emit('edit', product)"
            v-tooltip.top="'Tahrirlash'"
          />
          <Button
            icon="pi pi-trash"
            text
            rounded
            severity="danger"
            class="!h-9 !w-9 hover:!bg-rose-50 transition-colors"
            @click="$emit('delete', product._id)"
            v-tooltip.top="'O\'chirish'"
          />
        </div>
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