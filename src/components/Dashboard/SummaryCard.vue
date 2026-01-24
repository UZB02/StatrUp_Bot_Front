<template>
  <div class="relative group">
    <div 
      class="absolute inset-0 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-15 transition-opacity duration-500"
      :class="bgBaseClass"
    ></div>

    <div class="relative bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-slate-300/60">
      
      <div 
        class="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-1000" 
        :class="bgBaseClass"
      ></div>

      <div class="flex flex-col gap-5">
        <div class="flex items-center gap-4">
          <div 
            class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-500 group-hover:rotate-[12deg] group-hover:scale-110"
            :class="iconBgClass"
          >
            <i :class="[icon || 'pi pi-chart-line', colorClass]" class="text-xl"></i>
          </div>
          <span class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-tight">
            {{ title }}
          </span>
        </div>

        <div class="flex items-end justify-between">
          <div class="space-y-1">
            <h4 class="text-3xl font-black text-slate-800 tracking-tighter">
              {{ displayValue }}
            </h4>
            
            <div class="flex items-center gap-1.5 pt-1">
              <span class="w-2 h-2 rounded-full animate-pulse" :class="bgBaseClass"></span>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jonli ma'lumot</span>
            </div>
          </div>

          <div class="flex items-end gap-[3px] h-10 mb-1 opacity-10 group-hover:opacity-30 transition-opacity">
            <div v-for="i in 6" :key="i" 
                 class="w-[4px] rounded-full bg-slate-400" 
                 :style="{ height: (15 + Math.random() * 85) + '%' }">
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