<template>
  <div
    class="w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg border border-slate-200 p-6"
  >
    <!-- HEADER -->
    <div class="flex items-center gap-3 mb-5">
      <div
        class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-md"
      >
        <i class="pi pi-filter text-white text-xl"></i>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-slate-800">
          Ma'lumotlarni filtrlash
        </h3>
        <p class="text-sm text-slate-500">
          Kerakli davr, filial va mahsulotni tanlang
        </p>
      </div>
    </div>

    <!-- FILTER GRID -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- PERIOD -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-slate-700">Davr</label>
        <Dropdown
          v-model="filters.period"
          :options="periods"
          optionLabel="label"
          optionValue="value"
          placeholder="Davrni tanlang"
        />
      </div>

      <!-- YEAR -->
      <div v-if="showYear" class="flex flex-col gap-2">
        <label class="text-sm font-medium text-slate-700">Yil</label>
        <InputNumber
          v-model="filters.year"
          :useGrouping="false"
          placeholder="Yil"
        />
      </div>

      <!-- MONTH -->
      <div v-if="showMonth" class="flex flex-col gap-2">
        <label class="text-sm font-medium text-slate-700">Oy</label>
        <Dropdown
          v-model="filters.month"
          :options="months"
          optionLabel="label"
          optionValue="value"
          placeholder="Oyni tanlang"
        />
      </div>

      <!-- DATE (FROM) -->
      <!-- <div v-if="showFrom" class="flex flex-col gap-2">
        <label class="text-sm font-medium text-slate-700">
          {{ filters.period === "day" ? "Kun" : "Boshlanish sanasi" }}
        </label>
        <Calendar
          v-model="filters.from"
          dateFormat="yy-mm-dd"
          showIcon
        />
      </div> -->

      <!-- TO DATE (FAQAT YEAR/MONTH/WEEK) -->
      <!-- <div v-if="showTo" class="flex flex-col gap-2">
        <label class="text-sm font-medium text-slate-700">
          Tugash sanasi
        </label>
        <Calendar
          v-model="filters.to"
          dateFormat="yy-mm-dd"
          showIcon
        />
      </div> -->

      <!-- FILIAL -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-slate-700">Filial</label>
        <Dropdown
          v-model="filters.filial"
          :options="filials"
          optionLabel="name"
          optionValue="_id"
          showClear
          placeholder="Filial"
        />
      </div>

      <!-- PRODUCT -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-slate-700">Mahsulot</label>
        <Dropdown
          v-model="filters.product"
          :options="products"
          optionLabel="name"
          optionValue="_id"
          showClear
          filter
          placeholder="Mahsulot"
        />
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
      <Button
        label="Filter qo'llash"
        icon="pi pi-check"
        @click="apply"
      />
      <Button
        label="Tozalash"
        icon="pi pi-times"
        severity="secondary"
        outlined
        @click="clear"
      />
      <Button
        label="Excel"
        icon="pi pi-file-excel"
        severity="success"
        @click="$emit('exportExcel')"
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
