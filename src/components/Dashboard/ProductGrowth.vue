<template>
  <div class="carousel-container relative">
    <div class="absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-40 bg-blue-400 opacity-10 blur-[80px] pointer-events-none"></div>

    <Carousel
      :value="data"
      :numVisible="3"
      :numScroll="1"
      :responsiveOptions="responsiveOptions"
      circular
      :autoplayInterval="4000"
      class="custom-carousel"
    >
      <template #item="{ data: i }">
        <div class="px-3 py-2">
          <div
            class="group relative bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/40 border border-slate-50 flex items-center justify-between overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-1"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div class="relative z-10 flex flex-col gap-1">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                {{ i.productName }}
              </span>
              <h4 class="text-xl font-black text-slate-800 tracking-tight">
                {{ format(i.current) }}
              </h4>
            </div>

            <div class="relative z-10 flex flex-col items-end gap-1">
              <div
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black shadow-sm transition-all duration-500 group-hover:scale-110"
                :class="i.growth >= 0 
                  ? 'bg-emerald-50 text-emerald-600 shadow-emerald-100' 
                  : 'bg-rose-50 text-rose-600 shadow-rose-100'"
              >
                <i
                  class="pi text-[10px]"
                  :class="i.growth >= 0 ? 'pi-arrow-up-right' : 'pi-arrow-down-right'"
                />
                {{ Math.abs(i.growth) }}%
              </div>
              <span class="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">O'zgarish</span>
            </div>
          </div>
        </div>
      </template>
    </Carousel>
  </div>
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
  { breakpoint: "1280px", numVisible: 3, numScroll: 1 },
  { breakpoint: "1024px", numVisible: 2, numScroll: 1 },
  { breakpoint: "640px", numVisible: 1, numScroll: 1 },
];
</script>

<style scoped>
/* Karusel navigatsiyasini (nuqtalarini) modernizatsiya qilish */
:deep(.p-carousel-indicators) {
  padding: 1.5rem 0 0 0;
}

:deep(.p-carousel-indicator button) {
  width: 10px !important;
  height: 10px !important;
  border-radius: 50% !important;
  background-color: #e2e8f0 !important;
  transition: all 0.3s ease;
}

:deep(.p-carousel-indicator.p-highlight button) {
  width: 28px !important;
  border-radius: 10px !important;
  background-color: #3b82f6 !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Navigatsiya tugmalari (arrow) dizayni */
:deep(.p-carousel-prev), :deep(.p-carousel-next) {
  width: 2.5rem !important;
  height: 2.5rem !important;
  border-radius: 14px !important;
  background: white !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid #f1f5f9 !important;
  color: #64748b !important;
  transition: all 0.3s;
}

:deep(.p-carousel-prev:hover), :deep(.p-carousel-next:hover) {
  background: #3b82f6 !important;
  color: white !important;
  border-color: #3b82f6 !important;
}
</style>