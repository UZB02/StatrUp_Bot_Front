<template>
  <div class="w-full space-y-6">
    <DataTable
      :value="users"
      :loading="loading"
      paginator
      :rows="10"
      responsiveLayout="stack"
      breakpoint="960px"
      class="p-datatable-custom overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50"
      rowHover
    >
      <Column header="Foydalanuvchi" class="min-w-[200px]">
        <template #body="{ data }">
          <div class="flex items-center gap-4 py-1">
            <div class="relative group">
              <UserAvatar :name="data.fullname" class="!w-12 !h-12 border-2 border-white shadow-md group-hover:scale-110 transition-transform" />
              <div v-if="data.balance > 0" class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-black text-slate-800 leading-tight">{{ data.fullname }}</span>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">ID: {{ data._id?.slice(-6).toUpperCase() }}</span>
            </div>
          </div>
        </template>
      </Column>

      <Column header="Aloqa" class="min-w-[150px]">
        <template #body="{ data }">
          <div class="flex items-center gap-2 text-slate-600">
            <i class="pi pi-phone text-[10px] text-slate-300"></i>
            <span class="text-xs font-bold tracking-tight">{{ data.phone }}</span>
          </div>
        </template>
      </Column>

      <Column header="Avtomobil">
        <template #body="{ data }">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-sm">
            <i class="pi pi-car text-[10px] opacity-60"></i>
            <span class="text-[11px] font-black uppercase tracking-wider">{{ data.autoNumber }}</span>
          </div>
        </template>
      </Column>

      <Column header="Balans">
        <template #body="{ data }">
          <div class="flex flex-col items-start gap-1">
            <div :class="[
              'px-3 py-1 rounded-full text-[11px] font-black shadow-sm border',
              data.balance >= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
            ]">
              {{ formatCurrency(data.balance) }}
            </div>
          </div>
        </template>
      </Column>

      <Column header="Boshqaruv" headerClass="text-center" >
        <template #body="{ data }">
          <div class="flex items-center gap-3 justify-end pr-2">
            <div class="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100 gap-1">
              <Button 
                v-tooltip.top="'Balans qo‘shish'" 
                icon="pi pi-plus" 
                @click="openAdd(data)"
                class="!w-9 !h-9 !rounded-xl !bg-emerald-500 !border-none !text-white hover:!scale-105 active:!scale-95 transition-all" 
              />
              <Button 
                v-tooltip.top="'Balans sarflash'" 
                icon="pi pi-minus" 
                @click="openSpend(data)"
                class="!w-9 !h-9 !rounded-xl !bg-rose-500 !border-none !text-white hover:!scale-105 active:!scale-95 transition-all" 
              />
            </div>

            <div class="h-6 w-px bg-slate-200 mx-1"></div>

            <Button 
              icon="pi pi-pencil" 
              @click="$emit('edit', data)"
              class="!w-9 !h-9 !rounded-xl !bg-white !text-amber-500 !border !border-amber-100 hover:!bg-amber-50 transition-all" 
            />
            <Button 
              icon="pi pi-trash" 
              @click="$emit('delete', data)"
              class="!w-9 !h-9 !rounded-xl !bg-white !text-rose-400 !border !border-rose-100 hover:!bg-rose-50 transition-all" 
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <AddBalanceDialog v-model="addDialog" :user="selectedUser" @saved="$emit('updated')" />
    <SpendBalanceDialog v-model="spendDialog" :user="selectedUser" @saved="$emit('updated')" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import { formatCurrency } from "@/utils/formatCurrency";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";

import UserAvatar from "./UserAvatar.vue";
import AddBalanceDialog from "./AddBalanceDialog.vue";
import SpendBalanceDialog from "./SpendBalanceDialog.vue";

defineProps({
  users: Array,
  loading: Boolean
});

defineEmits(["edit", "delete", "updated"]);

const selectedUser = ref(null);
const addDialog = ref(false);
const spendDialog = ref(false);

const openAdd = (user) => {
  selectedUser.value = user;
  addDialog.value = true;
};

const openSpend = (user) => {
  selectedUser.value = user;
  spendDialog.value = true;
};
</script>
<style scoped>
/* PrimeVue DataTable custom styling */
:deep(.p-datatable-custom) {
  border: none !important;
}

:deep(.p-datatable-custom .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 1.5rem 1rem;
  border-bottom: 2px solid #f1f5f9;
}

:deep(.p-datatable-custom .p-datatable-tbody > tr) {
  transition: all 0.2s ease;
}

:deep(.p-datatable-custom .p-datatable-tbody > tr > td) {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid #f8fafc;
}

:deep(.p-datatable-custom .p-datatable-tbody > tr:hover) {
  background: #f1f5f9/30 !important;
}

:deep(.p-paginator) {
  background: transparent !important;
  border: none !important;
  padding: 1.5rem !important;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: #3b82f6 !important;
  color: white;
  border-radius: 12px;
}
</style>