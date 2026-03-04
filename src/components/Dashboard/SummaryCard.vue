<template>
  <div class="relative group">
    <div 
      class="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"
      :class="bgBaseClass"
    ></div>

    <div class="relative bg-white rounded-2xl p-4 shadow-md shadow-slate-200/40 border border-slate-50 overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-slate-300/50">
      
      <div 
        class="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.02] group-hover:scale-125 transition-transform duration-1000" 
        :class="bgBaseClass"
      ></div>

      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div 
            class="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm transition-all duration-500 group-hover:rotate-6 group-hover:scale-105"
            :class="iconBgClass"
          >
            <i :class="[icon || 'pi pi-chart-line', colorClass]" class="text-base"></i>
          </div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
            {{ title }}
          </span>
        </div>

        <div class="flex items-end justify-between">
          <div class="space-y-0.5">
            <h4 class="text-xl font-black text-slate-800 tracking-tight">
              {{ displayValue }}
            </h4>
            
            <div class="flex items-center gap-1.5 pt-0.5">
              <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="bgBaseClass"></span>
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Jonli</span>
            </div>
          </div>

          <div class="flex items-end gap-[2px] h-8 mb-0.5 opacity-10 group-hover:opacity-20 transition-opacity">
            <div v-for="i in 5" :key="i" 
                 class="w-[3px] rounded-full bg-slate-400" 
                 :style="{ height: (20 + Math.random() * 80) + '%' }">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  value: { type: Number, default: 0 },
  color: { type: String, default: 'blue' }, // blue, green, red, gray
  icon: String, // Masalan: pi pi-wallet
  isCurrency: { type: Boolean, default: true },
});

// Qiymatni formatlash
const displayValue = computed(() => {
  const formatted = new Intl.NumberFormat("uz-UZ").format(props.value);
  return props.isCurrency ? `${formatted} so‘m` : `${formatted} ta`;
});

// Ranglar iyerarxiyasi
const colorClass = computed(() => {
  const colors = {
    green: "text-emerald-500",
    red: "text-rose-500",
    blue: "text-blue-500",
    gray: "text-slate-500",
  };
  return colors[props.color] || colors.blue;
});

const iconBgClass = computed(() => {
  const bgs = {
    green: "bg-emerald-50",
    red: "bg-rose-50",
    blue: "bg-blue-50",
    gray: "bg-slate-50",
  };
  return bgs[props.color] || bgs.blue;
});

const bgBaseClass = computed(() => {
  const bases = {
    green: "bg-emerald-500",
    red: "bg-rose-500",
    blue: "bg-blue-500",
    gray: "bg-slate-500",
  };
  return bases[props.color] || bases.blue;
});
</script>

<style scoped>
h4 {
  font-feature-settings: "tnum"; /* Raqamlar siljib ketmasligi uchun */
}
</style>