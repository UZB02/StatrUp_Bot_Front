<template>
  <Card>
    <template #title>Statistika</template>

    <template #content>
      <Skeleton v-if="loading" height="300px" />

      <Chart
        v-show="!loading && hasData"
        type="bar"
        :data="chartData"
        :options="options"
        style="height:300px"
      />

      <div
        v-if="!loading && !hasData"
        class="text-center text-gray-400 py-20"
      >
        Maʼlumot mavjud emas
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from "vue";
import Card from "primevue/card";
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

/* OPTIONS */
const options = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>
