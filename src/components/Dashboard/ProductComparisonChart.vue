<template>
  <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden transition-all duration-300">
    
    <div class="px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 bg-gradient-to-r from-slate-50/50 to-white">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <i class="pi pi- Ethics text-xl"></i>
          <i class="pi pi- arrows-h text-xl"></i> </div>
        <div>
          <h3 class="text-xl font-black text-slate-800 tracking-tight">
            Mahsulotlar bo‘yicha solishtirish
          </h3>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Top mahsulotlar samaradorligi tahlili
          </p>
        </div>
      </div>

      <div v-if="!loading" class="flex gap-4">
        <div v-for="(ds, idx) in chartData.datasets" :key="idx" class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: ds.backgroundColor }"></span>
          <span class="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{{ ds.label }}</span>
        </div>
      </div>
    </div>

    <div class="p-8">
      <div class="chart-wrapper relative h-[400px]">
        
        <div v-if="loading" class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
          <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ma'lumotlar yuklanmoqda...</span>
        </div>

        <Chart
          v-show="!loading"
          type="bar"
          :data="chartData"
          :options="options"
          class="w-full h-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import Chart from "primevue/chart";

const props = defineProps({
  chartData: Object,
  loading: Boolean,
});

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false, // Biz o'zimizning custom legendimizni yaratdik (tepada)
    },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 14,
      borderRadius: 16,
      titleFont: { size: 13, weight: '900', family: 'Inter' },
      bodyFont: { size: 12, family: 'Inter' },
      usePointStyle: true,
      boxPadding: 6,
      callbacks: {
        label: (ctx) => {
          let label = ctx.dataset.label || '';
          if (label) label += ': ';
          label += new Intl.NumberFormat("uz-UZ").format(ctx.raw) + " so‘m";
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false, drawBorder: false },
      ticks: {
        color: '#94a3b8',
        font: { size: 11, weight: '700' },
        padding: 10
      },
    },
    y: {
      beginAtZero: true,
      border: { display: false },
      grid: {
        color: '#f1f5f9',
        drawBorder: false,
      },
      ticks: {
        color: '#94a3b8',
        font: { size: 10, weight: '600' },
        padding: 10,
        callback: (v) => v >= 1000000 ? `${v / 1000000} mln` : v.toLocaleString(),
      },
    },
  },
  // Bar ustalari dizayni
  elements: {
    bar: {
      borderRadius: 10, // Ustunlarning tepasi yumaloq bo'lishi uchun
      borderSkipped: false,
      hoverBackgroundColor: '#2563eb', // Hover bo'lganda ko'k rang urg'usi
    }
  },
  // Ustunlar qalinligi va bo'shliqlar
  barPercentage: 0.6,
  categoryPercentage: 0.5,
}));
</script>

<style scoped>
/* Chart.js animatsiyasini silliqlashtirish */
:deep(.p-chart) {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>