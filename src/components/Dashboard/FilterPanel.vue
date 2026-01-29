<template>
  <div class="w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-8 transition-all duration-300">
    
    <div class="flex items-center gap-5 mb-8">
      <div class="relative">
        <div class="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-20 animate-pulse"></div>
        <div class="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg text-white">
          <i class="pi pi-filter text-2xl"></i>
        </div>
      </div>
      <div>
        <h3 class="text-2xl font-black text-slate-800 tracking-tight leading-none">
          Ma'lumotlarni filtrlash
        </h3>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mt-2">
          Kerakli davr, filial va mahsulotni tanlang
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      <div class="space-y-2 group">
        <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within:text-blue-500 transition-colors">
          <i class="pi pi-calendar-plus text-[10px]"></i> Davr
        </label>
        <Dropdown
          v-model="filters.period"
          :options="periods"
          optionLabel="label"
          optionValue="value"
          placeholder="Davrni tanlang"
          class="w-full !rounded-2xl !bg-slate-50 !border-none !py-1 focus:!ring-4 focus:!ring-blue-500/10 transition-all font-bold"
        />
      </div>

      <div v-if="showYear" class="space-y-2 group animate-fadein">
        <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
          <i class="pi pi-calendar text-[10px]"></i> Yil
        </label>
        <InputNumber
          v-model="filters.year"
          :useGrouping="false"
          placeholder="Yil"
          class="w-full"
          inputClass="!rounded-2xl !bg-slate-50 !border-none !py-3 !px-4 focus:!ring-4 focus:!ring-blue-500/10 transition-all font-bold"
        />
      </div>

      <div v-if="showMonth" class="space-y-2 group animate-fadein">
        <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
          <i class="pi pi-calendar text-[10px]"></i> Oy
        </label>
        <Dropdown
          v-model="filters.month"
          :options="months"
          optionLabel="label"
          optionValue="value"
          placeholder="Oyni tanlang"
          class="w-full !rounded-2xl !bg-slate-50 !border-none !py-1 font-bold"
        />
      </div>

      <div v-if="showFrom" class="space-y-2 group animate-fadein">
        <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
          <i class="pi pi-clock text-[10px]"></i> 
          {{ filters.period === "day" ? "Sana" : "Sana" }}
        </label>
        <Calendar
          v-model="filters.from"
          dateFormat="yy-mm-dd"
          showIcon
          class="w-full"
          inputClass="!rounded-2xl !bg-slate-50 !border-none !py-3 font-bold"
        />
      </div>

      <div class="space-y-2 group">
        <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within:text-blue-500 transition-colors">
          <i class="pi pi-map-marker text-[10px]"></i> Filial
        </label>
        <Dropdown
          v-model="filters.filial"
          :options="filials"
          optionLabel="name"
          optionValue="_id"
          showClear
          placeholder="Barcha filiallar"
          class="w-full !rounded-2xl !bg-slate-50 !border-none !py-1 font-bold"
        />
      </div>

      <div class="space-y-2 group">
        <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within:text-blue-500 transition-colors">
          <i class="pi pi-box text-[10px]"></i> Mahsulot
        </label>
        <Dropdown
          v-model="filters.product"
          :options="products"
          optionLabel="name"
          optionValue="_id"
          showClear
          filter
          placeholder="Barcha mahsulotlar"
          class="w-full !rounded-2xl !bg-slate-50 !border-none !py-1 font-bold"
        />
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100">
      <div class="flex flex-wrap gap-3">
        <Button
          label="Filter qo'llash"
          icon="pi pi-check-circle"
          @click="apply"
          class="!rounded-2xl !bg-blue-600 !border-none !px-8 !py-3 !font-black !uppercase !text-[10px] !tracking-widest !shadow-lg !shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
        />
        <Button
          label="Tozalash"
          icon="pi pi-refresh"
          severity="secondary"
          text
          @click="clear"
          class="!rounded-2xl !font-black !uppercase !text-[10px] !tracking-widest !text-slate-400 hover:!bg-slate-50 transition-all"
        />
      </div>
      
      <Button
        label="Eksport Excel"
        icon="pi pi-file-excel"
        severity="success"
        @click="$emit('exportExcel')"
        class="!rounded-2xl !bg-emerald-500 !border-none !px-8 !py-3 !font-black !uppercase !text-[10px] !tracking-widest !shadow-lg !shadow-emerald-200 hover:scale-105 active:scale-95 transition-all"
      />
    </div>
  </div>
</template>
<script setup>
import { computed, watch } from "vue";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import Calendar from "primevue/calendar";
import Button from "primevue/button";

const props = defineProps({
  filters: Object,
  periods: Array,
  months: Array,
  filials: Array,
  products: Array,
});

const emit = defineEmits(["reload"]);

/* === VISIBILITY LOGIC === */
const showYear = computed(() =>
  ["year", "month"].includes(props.filters.period)
);

const showMonth = computed(() =>
  ["month"].includes(props.filters.period)
);

const showFrom = computed(() =>
  ["day", "week"].includes(props.filters.period)
);

const showTo = computed(() =>
  ["year", "month", "week"].includes(props.filters.period)
);

/* === WATCH PERIOD CHANGE === */
watch(
  () => props.filters.period,
  (p) => {
    props.filters.from = null;
    props.filters.to = null;
    props.filters.month = null;

    if (p === "day") {
      props.filters.to = null; // day → to YO‘Q
    }
  }
);

/* === ACTIONS === */
const apply = () => {
  emit("reload");
};

const clear = () => {
  props.filters.period = "year";
  props.filters.year = new Date().getFullYear();
  props.filters.month = null;
  props.filters.from = null;
  props.filters.to = null;
  props.filters.filial = null;
  props.filters.product = null;
  emit("reload");
};
</script>
<style scoped>
/* Animatsiya */
.animate-fadein {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* PrimeVue dropdownlarini tozalash */
:deep(.p-dropdown), :deep(.p-calendar), :deep(.p-inputnumber) {
  box-shadow: none !important;
}

:deep(.p-dropdown-label) {
  padding: 0.75rem 1rem !important;
}

:deep(.p-dropdown-trigger) {
  width: 3rem !important;
}

:deep(.p-calendar-w-btn .p-datepicker-trigger) {
  background: transparent !important;
  border: none !important;
  color: #94a3b8 !important;
}
</style>