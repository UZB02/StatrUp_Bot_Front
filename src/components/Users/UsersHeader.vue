<template>
  <div class="relative overflow-hidden bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-6 md:p-8 mb-8 group">
    <div class="absolute -right-24 -top-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700"></div>
    
    <div class="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div class="flex items-center gap-5">
        <div class="relative">
          <div class="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-20 animate-pulse"></div>
          <div class="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 text-white">
            <i class="pi pi-users text-2xl"></i>
          </div>
        </div>
        
        <div class="space-y-1">
          <h2 class="text-3xl font-black text-slate-900 tracking-tight leading-none">
            Foydalanuvchilar
          </h2>
          <div class="flex items-center gap-2">
            <span class="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
              Boshqaruv paneli
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-4 items-stretch">
        <div class="relative group/search">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i class="pi pi-search text-slate-400 group-focus-within/search:text-blue-500 transition-colors"></i>
          </div>
          <InputText
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)"
            placeholder="Telefon yoki Avto raqam..."
            class="!pl-12 !pr-6 !py-4 !w-full md:!w-80 !rounded-2xl !bg-slate-50 !border-none focus:!ring-4 focus:!ring-blue-500/10 !transition-all !duration-300 font-bold text-slate-700 placeholder:font-medium placeholder:text-slate-300 shadow-inner"
          />
        </div>

        <Button
          label="Barchasi"
          icon="pi pi-refresh"
          @click="$emit('refresh')"
          class="!px-6 !py-4 !rounded-2xl !bg-white !border-2 !border-slate-100 !text-slate-600 hover:!border-blue-200 hover:!text-blue-600 hover:!bg-blue-50/50 !transition-all !duration-300 !font-black !uppercase !text-[10px] !tracking-widest !shadow-none active:scale-95"
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
/* Maxsus animatsiya yoki qo'shimcha stil kerak bo'lsa */
.shadow-inner {
  box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
}
</style>
