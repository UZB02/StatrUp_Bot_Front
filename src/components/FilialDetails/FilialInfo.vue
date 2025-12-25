<template>
  <div class="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
    <div class="relative p-6 space-y-4">
      <!-- Header -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-blue-100 rounded-lg">
            <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-bold text-gray-900 tracking-tight">{{ filial.name || "Filial nomi" }}</h2>
            <p class="text-sm text-gray-500 mt-0.5">
              {{ filial.address || "Manzil" }} <span v-if="filial.region">, {{ filial.region }}</span>
            </p>
          </div>
        </div>

        <!-- Status badge -->
        <div class="flex items-center gap-3 justify-between">
          <span class="text-xs font-medium text-gray-600 uppercase tracking-wider">Status</span>
          <Tag
            :value="filial.isActive ? 'Aktiv' : 'Noaktiv'"
            :severity="filial.isActive ? 'success' : 'danger'"
            class="!text-xs"
          />
        </div>
      </div>

      <!-- Divider -->
      <div class="h-px bg-gray-100"></div>

      <!-- Working hours -->
      <div class="flex items-center justify-between text-sm text-gray-600">
        <span>Ish vaqti:</span>
        <span>{{ filial.workingHours?.start || '09:00' }} - {{ filial.workingHours?.end || '18:00' }}</span>
      </div>

      <!-- Coordinates and Map -->
      <div v-if="hasValidLocation" class="flex flex-col gap-2">
        <div class="flex items-center justify-between text-sm text-gray-600">
          <span>Joylashuv:</span>
          <span>Lat: {{ filial.location.coordinates[1] }}, Lng: {{ filial.location.coordinates[0] }}</span>
        </div>

        <div class="h-64 w-full rounded-lg overflow-hidden border border-gray-200">
          <iframe
            :src="mapUrl"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
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

<style scoped></style>
