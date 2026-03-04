<template>
  <div class="p-2 lg:p-3 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row gap-2 lg:gap-3">
    <!-- QR SCANNER (FIXED SIZE) -->
    <div 
      class="flex-1 h-12 md:h-14 min-h-[48px] md:min-h-[56px] bg-white rounded-xl border border-slate-200 flex items-center px-4 gap-3 transition-all hover:border-blue-400/50 shadow-inner relative group cursor-text flex-shrink-0"
      @click="onScannerClick"
    >
      <i class="pi pi-qrcode text-lg md:text-xl flex-shrink-0" :class="isScanning ? 'text-blue-500 animate-pulse' : 'text-slate-400'"></i>
      
      <div class="flex-1 text-[11px] md:text-xs font-black uppercase tracking-widest truncate">
        <span v-if="isScanning" class="text-blue-500 animate-pulse">Skanerlanmoqda...</span>
        <span v-else-if="scanDisplay" class="text-blue-600 font-bold">{{ scanDisplay }}</span>
        <span v-else class="text-slate-400">Skaner kutish rejimi</span>
      </div>
      
      <div v-if="!isScanning && !scanDisplay" class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50 flex-shrink-0"></div>
      
      <!-- Hidden input for scanner focus -->
      <slot name="scanner-input"></slot>
    </div>

    <!-- MANUAL SEARCH (FIXED SIZE) -->
    <div class="w-full sm:w-48 md:w-72 h-12 md:h-14 min-h-[48px] md:min-h-[56px] relative flex-shrink-0">
      <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm md:text-base pointer-events-none"></i>
      <InputText
        :model-value="searchValue"
        @update:model-value="$emit('update:searchValue', $event)"
        placeholder="QIDIRUV..."
        class="!w-full !h-full !pl-11 !bg-white !border !border-slate-200 focus:!border-blue-400/50 !rounded-xl !text-[11px] md:!text-xs !font-black !uppercase tracking-widest !shadow-inner"
      />
    </div>
  </div>
</template>

<script setup>
import InputText from "primevue/inputtext";

defineProps({
  isScanning: Boolean,
  scanDisplay: String,
  searchValue: String
});

const emit = defineEmits(['update:searchValue', 'scanner-click']);

const onScannerClick = () => {
  emit('scanner-click');
};
</script>
