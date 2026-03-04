<template>
  <div class="w-full bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-5 transition-all duration-300">
    
    <div class="flex items-center gap-4 mb-5">
      <div class="relative">
        <div class="absolute inset-0 bg-blue-500 rounded-xl blur-md opacity-20 animate-pulse"></div>
        <div class="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md text-white">
          <i class="pi pi-filter text-lg"></i>
        </div>
      </div>
      <div>
        <h3 class="text-lg font-black text-slate-800 tracking-tight leading-none">
          Ma'lumotlarni filtrlash
        </h3>
        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
          Davr, filial va mahsulot
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      
      <div class="space-y-1.5 group">
        <label class="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">
          <i class="pi pi-calendar-plus text-[9px]"></i> Davr
        </label>
        <Dropdown
          v-model="filters.period"
          :options="periods"
          optionLabel="label"
          optionValue="value"
          placeholder="Davrni tanlang"
          class="w-full !rounded-xl !bg-slate-50 !border-none !py-0.5 focus:!ring-4 focus:!ring-blue-500/10 transition-all font-bold text-sm"
        />
      </div>

      <div v-if="showYear" class="space-y-1.5 group animate-fadein">
        <label class="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
          <i class="pi pi-calendar text-[9px]"></i> Yil
        </label>
        <InputNumber
          v-model="filters.year"
          :useGrouping="false"
          placeholder="Yil"
          class="w-full"
          inputClass="!rounded-xl !bg-slate-50 !border-none !py-2 !px-3 focus:!ring-4 focus:!ring-blue-500/10 transition-all font-bold text-sm"
        />
      </div>

      <div v-if="showMonth" class="space-y-1.5 group animate-fadein">
        <label class="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
          <i class="pi pi-calendar text-[9px]"></i> Oy
        </label>
        <Dropdown
          v-model="filters.month"
          :options="months"
          optionLabel="label"
          optionValue="value"
          placeholder="Oyni tanlang"
          class="w-full !rounded-xl !bg-slate-50 !border-none !py-0.5 font-bold text-sm"
        />
      </div>

      <div v-if="showFrom" class="space-y-1.5 group animate-fadein">
        <label class="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
          <i class="pi pi-clock text-[9px]"></i> 
          {{ filters.period === "day" ? "Sana" : "Sana" }}
        </label>
        <Calendar
          v-model="filters.from"
          dateFormat="yy-mm-dd"
          showIcon
          class="w-full"
          inputClass="!rounded-xl !bg-slate-50 !border-none !py-2 font-bold text-sm"
        />
      </div>

      <div class="space-y-1.5 group">
        <label class="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">
          <i class="pi pi-map-marker text-[9px]"></i> Filial
        </label>
        <Dropdown
          v-model="filters.filial"
          :options="filials"
          optionLabel="name"
          optionValue="_id"
          showClear
          placeholder="Barcha filiallar"
          class="w-full !rounded-xl !bg-slate-50 !border-none !py-0.5 font-bold text-sm"
        />
      </div>

      <div class="space-y-1.5 group">
        <label class="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">
          <i class="pi pi-box text-[9px]"></i> Mahsulot
        </label>
        <Dropdown
          v-model="filters.product"
          :options="products"
          optionLabel="name"
          optionValue="_id"
          showClear
          filter
          placeholder="Barcha mahsulotlar"
          class="w-full !rounded-xl !bg-slate-50 !border-none !py-0.5 font-bold text-sm"
        />
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
      <div class="flex flex-wrap gap-2">
        <Button
          label="Filter qo'llash"
          icon="pi pi-check-circle"
          @click="apply"
          class="!rounded-xl !bg-blue-600 !border-none !px-6 !py-2 !font-bold !uppercase !text-[9px] !tracking-wider !shadow-md !shadow-blue-100 hover:scale-105 active:scale-95 transition-all"
        />
        <Button
          label="Tozalash"
          icon="pi pi-refresh"
          severity="secondary"
          text
          @click="clear"
          class="!rounded-xl !font-bold !uppercase !text-[9px] !tracking-wider !text-slate-400 hover:!bg-slate-50 transition-all"
        />
      </div>
      <Button
        label="Eksport Excel"
        icon="pi pi-file-excel"
        severity="success"
        @click="$emit('exportExcel')"
        class="!rounded-xl !bg-emerald-500 !border-none !px-6 !py-2 !font-bold !uppercase !text-[9px] !tracking-wider !shadow-md !shadow-emerald-100 hover:scale-105 active:scale-95 transition-all"
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