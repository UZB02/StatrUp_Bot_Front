<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
          <i class="pi pi-users text-white text-xl"></i>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Foydalanuvchilar</h2>
          <p class="text-sm text-gray-500 mt-0.5">Barcha foydalanuvchilarni boshqaring</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative">
          <InputText
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)"
            placeholder="Telefon yoki Avto raqam qidirish..."
            class="pl-10 pr-4 py-2.5 w-full sm:w-80 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
        </div>
        <Button
          label="Barchasi"
          icon="pi pi-refresh"
          severity="secondary"
          class="px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105 active:scale-95 font-medium"
          @click="$emit('refresh')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import  InputText  from 'primevue/inputtext';
import Button from 'primevue/button';

defineProps({ 
  modelValue: String 
});

defineEmits(["update:modelValue", "refresh"]);
</script>

<style scoped>
/* Additional PrimeVue input styling */
:deep(.p-inputtext) {
  font-size: 0.875rem;
}

:deep(.p-inputtext:focus) {
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.2);
}
</style>
