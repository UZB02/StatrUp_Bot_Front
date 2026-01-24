<template>
  <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 p-8 transition-all duration-300">
    
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
          <i class="pi pi-chart-bar text-xl"></i>
        </div>
        <div>
          <h3 class="text-xl font-black text-slate-800 tracking-tight">Savdo statistikasi</h3>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Davrlar kesimidagi tahlil</p>
        </div>
      </div>

      <div v-if="hasData && !loading" class="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Jonli</span>
      </div>
    </div>

    <div class="relative min-h-[350px]">
      <div v-if="loading" class="space-y-4">
        <div class="flex items-end justify-between gap-4 h-[300px] pt-10">
          <Skeleton v-for="i in 7" :key="i" :height="(Math.random() * 60 + 20) + '%'" width="12%" borderRadius="12px" />
        </div>
      </div>

      <Chart
        v-show="!loading && hasData"
        type="bar"
        :data="chartData"
        :options="chartOptions"
        class="h-[350px] w-full"
      />

      <div
        v-if="!loading && !hasData"
        class="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4"
      >
        <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
          <i class="pi pi-database text-4xl"></i>
        </div>
        <div>
          <p class="text-sm font-black text-slate-400 uppercase tracking-widest">Maʼlumot mavjud emas</p>
          <p class="text-xs text-slate-300 mt-1">Tanlangan davr bo'yicha tranzaksiyalar topilmadi</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import Skeleton from "primevue/skeleton";
import Chart from "primevue/chart";

const props = defineProps({
  loading: Boolean,
  chartData: {
    type: Object,
    required: true,
  },
});

/* DATA BORLIGINI TEKSHIRISH */
const hasData = computed(() => {
  return (
    props.chartData &&
    props.chartData.labels &&
    props.chartData.labels.length > 0
  );
});

/* CHART OPTIONS - DIZAYNGA MOSLAB SOZLANGAN */
const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Legendni o'chirib, tepaga custom sarlavha qildik
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 14, weight: 'bold', family: 'Inter' },
        bodyFont: { size: 13, family: 'Inter' },
        borderRadius: 12,
        usePointStyle: true,
      }
    },
    scales: {
      x: {
        grid: {
          display: false, // Vertikal chiziqlarni o'chirish
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 11, weight: '600' }
        }
      },
      y: {
        grid: {
          color: '#f1f5f9', // Gorizontal chiziqlarni juda och rang qilish
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 11, weight: '600' },
          callback: (value) => value.toLocaleString() // Raqamlarni chiroyli formatlash
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };
});
</script>

<style scoped>
/* Chart konteyneri uchun maxsus stil */
:deep(.p-chart) {
  height: 100% !important;
}
</style>