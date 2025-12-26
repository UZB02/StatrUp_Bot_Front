<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    <Skeleton v-if="loading" v-for="i in 4" :key="i" height="110px" />

    <template v-else>
      <SummaryCard title="Jami Tushum" :value="summary?.earn" color="green" />
      <SummaryCard title="Jami Xarajat" :value="summary?.spend" color="red" />
      <SummaryCard title="Sof Balans" :value="summary?.balance" color="blue" />
    <SummaryCard title="Tranzaksiyalar" :value="summary?.earnCount + summary?.spendCount" color="gray" :isCurrency="false" />
    </template>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
import SummaryCard from "./SummaryCard.vue";
import { defineProps } from "vue";

const props = defineProps({
  loading: Boolean,
  summary: Object,
});
</script>
