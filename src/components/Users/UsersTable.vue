<template>
  <div class="h-full flex flex-col bg-white overflow-hidden">
    <DataTable
      :value="users"
      :loading="loading"
      paginator
      :rows="20"
      responsiveLayout="scroll"
      class="p-datatable-pos flex-1 flex flex-col overflow-hidden"
      rowHover
      dataKey="_id"
      v-model:selection="selection"
      selectionMode="single"
      @row-click="onRowClick"
    >
      <template #empty>
        <div class="p-12 text-center flex flex-col items-center">
          <i class="pi pi-users text-4xl text-slate-100 mb-3"></i>
          <p class="text-slate-400 font-bold text-xs uppercase">Mijozlar ro'yxati bo'sh</p>
        </div>
      </template>

      <Column header="Mijoz (Ism / Tel)" class="w-[280px]">
        <template #body="{ data }">
          <div class="flex items-center gap-3 py-0.5">
            <UserAvatar :name="data.fullname" class="!w-8 !h-8 border border-slate-100 shadow-sm" />
            <div class="flex flex-col min-w-0">
              <span class="text-[12px] font-black text-slate-800 leading-tight truncate">{{ data.fullname }}</span>
              <span class="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{{ data.phone }}</span>
            </div>
          </div>
        </template>
      </Column>

      <Column header="Avtomobil" class="w-[140px]">
        <template #body="{ data }">
          <div class="inline-flex items-center gap-2 px-2 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
            <i class="pi pi-car text-[8px] text-slate-400"></i>
            <span class="text-[10px] font-black uppercase tracking-wider">{{ data.autoNumber }}</span>
          </div>
        </template>
      </Column>

      <Column header="Balans" class="w-[150px]">
        <template #body="{ data }">
          <div :class="[
            'inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-black border',
            data.balance >= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
          ]">
            {{ formatCurrency(data.balance) }}
          </div>
        </template>
      </Column>

      <Column header="Status" class="w-[100px]">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full" :class="data.balance > 0 ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-slate-300'"></span>
            <span class="text-[8px] font-black uppercase tracking-widest text-slate-400">
              {{ data.balance > 0 ? 'Active' : 'N/A' }}
            </span>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { formatCurrency } from "@/utils/formatCurrency";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import UserAvatar from "./UserAvatar.vue";

const props = defineProps({
  users: Array,
  loading: Boolean,
  selectedId: String
});

const emit = defineEmits(["edit", "delete", "updated", "select"]);

const selection = ref(null);

const onRowClick = (event) => {
  emit('select', event.data);
};

// Sync selection if selectedId changes
watch(() => props.selectedId, (newId) => {
  if (!newId) selection.value = null;
  else if (props.users) {
    selection.value = props.users.find(u => u._id === newId);
  }
}, { immediate: true });
</script>

<style scoped>
:deep(.p-datatable-pos) {
  border: none !important;
}

:deep(.p-datatable-pos .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #94a3b8;
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.p-datatable-pos .p-datatable-tbody > tr) {
  transition: all 0.1s ease;
  cursor: pointer;
}

:deep(.p-datatable-pos .p-datatable-tbody > tr > td) {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #f8fafc;
}

:deep(.p-datatable-pos .p-datatable-tbody > tr.p-highlight) {
  background: #eff6ff !important;
  border-left: 3px solid #3b82f6 !important;
}

:deep(.p-datatable-pos .p-datatable-tbody > tr.p-highlight td) {
  color: #1e3a8a !important;
}

:deep(.p-datatable-pos .p-datatable-tbody > tr:hover:not(.p-highlight)) {
  background: #f1f5f9 !important;
}

:deep(.p-paginator) {
  background: #f8fafc !important;
  border-top: 1px solid #f1f5f9 !important;
  padding: 0.35rem !important;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  min-width: 2rem;
  height: 2rem;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: #3b82f6 !important;
  color: white;
}
</style>