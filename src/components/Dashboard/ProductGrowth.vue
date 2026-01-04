<template>
  <Carousel
    :value="data"
    :numVisible="3"
    :numScroll="1"
    :responsiveOptions="responsiveOptions"
    circular
    :autoplayInterval="5000"
    class="w-full"
  >
    <template #item="{ data: i }">
      <div class="px-2">
        <div
          class="bg-white rounded-xl p-4 shadow flex items-center justify-between h-full"
        >
          <div>
            <p class="text-sm text-gray-500">
              {{ i.productName }}
            </p>
            <p class="text-lg font-semibold">
              {{ format(i.current) }}
            </p>
          </div>

          <div
            class="text-sm font-semibold flex items-center gap-1"
            :class="i.growth >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            <i
              class="pi"
              :class="i.growth >= 0 ? 'pi-arrow-up' : 'pi-arrow-down'"
            />
            {{ Math.abs(i.growth) }}%
          </div>
        </div>
      </div>
    </template>
  </Carousel>
</template>

<script setup>
import Carousel from "primevue/carousel";

defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const format = (n) =>
  new Intl.NumberFormat("uz-UZ").format(n) + " so‘m";

const responsiveOptions = [
  {
    breakpoint: "1024px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "640px",
    numVisible: 1,
    numScroll: 1,
  },
];
</script>
