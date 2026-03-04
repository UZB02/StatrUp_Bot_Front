<template>
  <div class="h-auto lg:h-12 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between px-3 py-2 lg:py-0 flex-shrink-0 z-20 shadow-sm gap-2">
    <div class="flex items-center gap-2 lg:gap-3">
      <div class="flex items-center gap-2 px-2 lg:px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg">
        <i class="pi pi-desktop text-[10px] text-blue-600"></i>
        <span class="text-blue-700 font-black text-[9px] lg:text-[10px] tracking-widest uppercase truncate max-w-[80px] lg:max-w-none">TERMINAL-01</span>
      </div>
      <div class="h-4 w-px bg-slate-200 hidden sm:block"></div>
      <div class="flex items-center gap-3 lg:gap-4 text-slate-500">
        <div class="flex flex-col">
          <span class="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase leading-none">Vaqt</span>
          <span class="text-[10px] lg:text-[11px] font-bold text-slate-700 mt-0.5">{{ currentTime }}</span>
        </div>
        <div class="flex flex-col border-l border-slate-100 pl-3 lg:pl-4">
          <span class="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase leading-none">Mijozlar</span>
          <span class="text-[10px] lg:text-[11px] font-bold text-blue-600 mt-0.5">{{ usersCount }}</span>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 lg:gap-3 ml-auto">
      <div class="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
        <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        <span class="text-[10px] font-bold text-slate-600 uppercase tracking-tight truncate max-w-[100px]">{{ adminName }}</span>
      </div>
      <button @click="$emit('refresh')" class="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-all border border-slate-200 cursor-pointer flex items-center justify-center shadow-sm">
        <i class="pi pi-refresh text-xs" :class="{ 'animate-spin': loading }"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

defineProps({
  usersCount: Number,
  adminName: String,
  loading: Boolean
});

defineEmits(['refresh']);

const currentTime = ref("");

const updateClock = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('uz-UZ', { hour12: false });
};

let clockInterval;
onMounted(() => {
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
});

onUnmounted(() => clearInterval(clockInterval));
</script>
