<template>
  <div v-if="user" class="flex flex-col gap-3 h-full animate-fade-in overflow-y-auto">
    <!-- CUSTOMER MINI-CARD -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm relative overflow-hidden flex-shrink-0">
      <div class="flex items-center gap-3 mb-4">
        <UserAvatar :name="user.fullname" class="!w-10 md:!w-14 !h-10 md:!h-14 border border-slate-200" />
        <div class="flex-1 min-w-0">
          <h3 class="text-slate-900 text-[13px] md:text-base font-black leading-tight truncate">{{ user.fullname }}</h3>
          <p class="text-blue-600 font-bold text-[9px] md:text-[11px] mt-1">{{ user.phone }}</p>
          <div class="flex items-center gap-1.5 mt-2">
            <span class="px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-[7px] md:text-[9px] font-black text-slate-500 uppercase">ID: {{ user._id?.slice(-8).toUpperCase() }}</span>
            <span class="px-1.5 py-0.5 bg-slate-900 rounded text-[7px] md:text-[9px] font-black text-white uppercase">{{ user.autoNumber }}</span>
          </div>
        </div>
        <button @click="$emit('close')" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 border-none cursor-pointer">
          <i class="pi pi-times text-xs"></i>
        </button>
      </div>

      <div class="bg-slate-50 rounded-xl p-3 md:p-5 flex items-center justify-between border border-slate-100">
        <span class="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Joriy Balans</span>
        <div class="text-lg md:text-2xl font-black mt-0.5" :class="user.balance >= 0 ? 'text-emerald-500' : 'text-rose-500'">
          {{ formatCurrency(user.balance) }}
        </div>
      </div>
    </div>

    <!-- ACTIONS PANEL -->
    <div class="flex-1 bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm flex flex-col gap-3 md:gap-5">
      <h4 class="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Terminal Operatsiyalari</h4>
      
      <div class="grid grid-cols-2 gap-3 md:gap-4">
        <button @click="$emit('transaction', 'add')" class="flex flex-col items-center justify-center gap-2 py-4 md:py-6 bg-emerald-500 hover:bg-emerald-600 rounded-2xl border-none cursor-pointer transition-all active:scale-95 shadow-lg shadow-emerald-500/10">
          <i class="pi pi-plus-circle text-white text-lg md:text-2xl"></i>
          <span class="text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest">To'ldirish</span>
        </button>
        <button @click="$emit('transaction', 'spend')" class="flex flex-col items-center justify-center gap-2 py-4 md:py-6 bg-rose-500 hover:bg-rose-600 rounded-2xl border-none cursor-pointer transition-all active:scale-95 shadow-lg shadow-rose-500/10">
          <i class="pi pi-minus-circle text-white text-lg md:text-2xl"></i>
          <span class="text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest">Yechish</span>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-3 mt-1">
        <button @click="$emit('edit', user)" class="py-3.5 md:py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-600 font-bold text-[10px] md:text-[11px] uppercase transition-all cursor-pointer">
          Tahrirlash
        </button>
        <button @click="$emit('delete', user)" class="py-3.5 md:py-4 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 rounded-2xl border border-slate-200 text-slate-400 font-bold text-[10px] md:text-[11px] uppercase transition-all cursor-pointer">
          O'chirish
        </button>
      </div>

      <div class="mt-auto hidden lg:flex bg-blue-50 border border-blue-100 rounded-xl p-3 gap-3">
        <i class="pi pi-info-circle text-blue-500 text-sm mt-0.5"></i>
        <p class="text-[10px] text-slate-500 leading-normal font-medium">
          Operatsiyani tasdiqlashdan avval mijoz ma'lumotlarini tekshiring.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from "@/utils/formatCurrency";
import UserAvatar from "./UserAvatar.vue";

defineProps({
  user: Object
});

defineEmits(['close', 'transaction', 'edit', 'delete']);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
