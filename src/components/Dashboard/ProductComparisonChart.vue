<template>
  <div class="bg-white rounded-xl shadow p-4">
    <h3 class="text-lg font-semibold mb-3">
      Mahsulotlar bo‘yicha solishtirish
    </h3>

    <div class="chart-wrapper">
      <Chart
        v-if="!loading"
        type="bar"
        :data="chartData"
        :options="options"
        style="height:400px"
      />

      <div
        v-else
        class="flex items-center justify-center h-full text-gray-400 text-sm"
      >
        Yuklanmoqda...
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import Chart from "primevue/chart";

defineProps({
  chartData: Object,
  loading: Boolean,
});

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
        boxWidth: 12,
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) =>
          `${ctx.dataset.label}: ${new Intl.NumberFormat("uz-UZ").format(
            ctx.raw
          )} so‘m`,
      },
    },
  },

  scales: {
    x: {
      grid: { display: false },
      ticks: {
        font: { size: 12 },
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: (v) => `${v / 1_000_000} mln`,
      },
      grid: {
        borderDash: [4, 4],
      },
    },
  },

  // 🔥 BAR QALINLIGI
  datasets: {
    bar: {
      barPercentage: 0.55,       // 🔥 yo‘g‘onlik
      categoryPercentage: 0.6,   // 🔥 bo‘shliq nazorati
      borderRadius: 6,
    },
  },
}));
</script>

<style scoped>
.chart-wrapper {
  height: 420px; /* 🔥 ASOSIY */
}
</style>
