<template>
  <div class="group relative overflow-hidden rounded-[2.5rem] bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 border border-white p-2">
    <div class="relative p-6 md:p-8 space-y-6">
      
      <div class="flex flex-col sm:flex-row items-start justify-between gap-6">
        <div class="flex items-start gap-5">
          <div class="relative flex-shrink-0">
            <div class="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div class="relative p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-100 text-white">
              <i class="pi pi-map-marker text-xl"></i>
            </div>
          </div>
          
          <div class="space-y-1">
            <h2 class="text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-emerald-600 transition-colors">
              {{ filial.name || "Markaziy Filial" }}
            </h2>
            <div class="flex items-center gap-2 text-slate-400">
              <i class="pi pi-directions text-[10px]"></i>
              <p class="text-sm font-medium">
                {{ filial.address || "Manzil ko'rsatilmadi" }}<span v-if="filial.region" class="text-slate-300"> • {{ filial.region }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2 self-end sm:self-start">
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Filial holati</span>
          <Tag
            :value="filial.isActive ? 'Aktiv' : 'Yopiq'"
            :class="[
              '!px-4 !py-1.5 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest !border-none shadow-sm',
              filial.isActive ? '!bg-emerald-50 !text-emerald-600' : '!bg-rose-50 !text-rose-600'
            ]"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group/item hover:bg-white hover:border-emerald-100 transition-all">
          <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm group-hover/item:scale-110 transition-transform">
            <i class="pi pi-clock text-sm"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ish vaqti</p>
            <p class="text-sm font-black text-slate-700">
              {{ filial.workingHours?.start || '09:00' }} — {{ filial.workingHours?.end || '20:00' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group/item hover:bg-white hover:border-emerald-100 transition-all">
          <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm group-hover/item:scale-110 transition-transform">
            <i class="pi pi-compass text-sm"></i>
          </div>
          <div class="overflow-hidden">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Koordinatalar</p>
            <p class="text-sm font-black text-slate-700 truncate">
              {{ filial?.location?.coordinates[1] }}, {{ filial?.location?.coordinates[0] }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="hasValidLocation" class="relative group/map">
        <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[2rem] opacity-0 group-hover/map:opacity-10 blur transition duration-500"></div>
        
        <div class="relative h-72 w-full rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100">
          <iframe
            :src="mapUrl"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="filter grayscale-[0.2] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
          ></iframe>
        </div>
      </div>
    </div>

    <div class="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
  </div>
</template>
<script setup>
import Tag from "primevue/tag";
import { computed } from "vue";

const props = defineProps({
  filial: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

/* Google Maps URL */
const hasValidLocation = computed(() => {
  return props.filial.location &&
         Array.isArray(props.filial.location.coordinates) &&
         props.filial.location.coordinates.length === 2 &&
         !(props.filial.location.coordinates[0] === 0 && props.filial.location.coordinates[1] === 0);
});

const mapUrl = computed(() => {
  if (!hasValidLocation.value) return "";
  const lat = props.filial.location.coordinates[1];
  const lng = props.filial.location.coordinates[0];
  return `https://www.google.com/maps?q=${lat},${lng}&hl=ru&z=15&output=embed`;
});
</script>
<style scoped>
/* Iframe-ni biroz yumshatish uchun */
iframe {
  transition: all 0.5s ease-in-out;
}
</style>
