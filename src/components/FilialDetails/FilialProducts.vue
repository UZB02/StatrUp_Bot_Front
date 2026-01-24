<template>
  <div class="min-h-screen bg-[#f8fafc] pb-12">
    <div class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-8 py-5">
        <div class="flex items-center justify-between gap-4">
          <div class="space-y-1">
            <h1 class="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Mahsulotlar</h1>
            <div class="flex items-center gap-2">
              <div class="h-1.5 w-12 bg-emerald-500 rounded-full"></div>
              <p class="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest italic">
                Ombor nazorati va inventarizatsiya
              </p>
            </div>
          </div>
          
          <Button 
            @click="openAdd"
            class="!bg-emerald-600 !border-none !rounded-2xl !h-12 !w-12 md:!w-auto md:!px-8 !shadow-lg !shadow-emerald-200 hover:!scale-105 active:scale-95 transition-all"
          >
            <i class="pi pi-plus font-bold text-white"></i>
            <span class="hidden md:inline ml-2 font-black whitespace-nowrap text-white">Yangi Mahsulot</span>
          </Button>
        </div>
      </div>
    </div>

    <div class="max-w-[1400px] mx-auto px-4 sm:px-8 mt-8">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
          <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <i class="pi pi-box text-2xl"></i>
          </div>
          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jami turlar</p>
            <p class="text-2xl font-black text-slate-900">{{ products.length }} ta</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white overflow-hidden">
        <DataTable 
          :value="products" 
          paginator 
          :rows="10"
          responsiveLayout="scroll"
          class="p-datatable-modern"
          stripedRows
        >
          <template #empty>
            <div class="text-center py-20">
              <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i class="pi pi-search text-4xl text-slate-200"></i>
              </div>
              <h3 class="text-xl font-black text-slate-400">Mahsulotlar topilmadi</h3>
            </div>
          </template>

          <Column field="name" header="Mahsulot Nomi" class="min-w-[200px]">
            <template #body="{ data }">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-emerald-50 transition-colors">
                  <i class="pi pi-tag text-slate-400 group-hover:text-emerald-500"></i>
                </div>
                <span class="font-bold text-slate-800 tracking-tight">{{ data.name }}</span>
              </div>
            </template>
          </Column>

          <Column field="unit" header="Birlik">
            <template #body="{ data }">
              <span class="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-tighter border border-slate-200/50">
                {{ data.unit }}
              </span>
            </template>
          </Column>

          <Column field="quantity" header="Ombordagi qoldiq" class="w-[200px]">
            <template #body="{ data }">
              <div class="space-y-2">
                <div class="flex justify-between items-center px-1">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ data.quantity }} {{ data.unit }}</span>
                  <span class="text-[10px] font-bold text-emerald-500">{{ Math.min(Math.round((data.quantity / 1000) * 100), 100) }}%</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000" 
                    :style="{ width: `${Math.min((data.quantity / 1000) * 100, 100)}%` }"
                  ></div>
                </div>
              </div>
            </template>
          </Column>

          <Column field="price" header="Narxi">
            <template #body="{ data }">
              <div class="py-1">
                <p class="text-lg font-black text-emerald-600 leading-none mb-1">{{ formatCurrency(data.price) }}</p>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">1 {{ data.unit }} uchun</p>
              </div>
            </template>
          </Column>

          <Column field="discount" header="Chegirma">
            <template #body="{ data }">
              <div v-if="data.discount > 0" class="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-xl border border-orange-100">
                <i class="pi pi-percentage text-[10px] font-bold"></i>
                <span class="text-xs font-black">{{ data.discount }}</span>
              </div>
              <span v-else class="text-slate-300 font-bold">—</span>
            </template>
          </Column>

          <Column header="Boshqaruv" class="text-right">
            <template #body="{ data }">
              <div class="flex gap-2 justify-end">
                <Button 
                  icon="pi pi-pencil" 
                  @click="edit(data)"
                  class="!w-10 !h-10 !rounded-xl !bg-slate-50 !text-slate-600 !border-none hover:!bg-amber-50 hover:!text-amber-600 transition-all"
                />
                <Button 
                  icon="pi pi-trash" 
                  @click="remove(data._id)"
                  class="!w-10 !h-10 !rounded-xl !bg-slate-50 !text-slate-400 !border-none hover:!bg-rose-50 hover:!text-rose-600 transition-all"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <ProductDialog
      v-model:visible="showDialog"
      :product="editingProduct"
      :filialId="filialId"
      @saved="emit('refresh')"
    />
  </div>
</template>
<script setup>
import { ref } from "vue";
import api from "@/utils/api";
import { formatCurrency } from "@/utils/formatCurrency";

import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tooltip from "primevue/tooltip";

import ProductDialog from "./ProductDialog.vue";

defineProps({
  products: Array,
  filialId: String
});

const emit = defineEmits(["refresh"]);

const showDialog = ref(false);
const editingProduct = ref(null);

const openAdd = () => {
  editingProduct.value = null;
  showDialog.value = true;
};

const edit = (product) => {
  editingProduct.value = product;
  showDialog.value = true;
};

const remove = async (id) => {
  if (!confirm("Ushbu mahsulotni o'chirishni xohlaysizmi?")) return;
  try {
    await api.delete(`/products/${id}`);
    emit("refresh");
  } catch (error) {
    console.error("O'chirishda xato:", error);
  }
};
</script>

<style scoped>
:deep(.p-datatable-modern .p-datatable-thead > tr > th) {
  background: #fdfdfd;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.p-datatable-modern .p-datatable-tbody > tr) {
  background: white;
  transition: all 0.3s ease;
}

:deep(.p-datatable-modern .p-datatable-tbody > tr:hover) {
  background: #f8fafc;
  transform: scale(0.998);
}

:deep(.p-datatable-modern .p-datatable-tbody > tr > td) {
  padding: 1.25rem;
  border: none;
}

/* Pagination Styling */
:deep(.p-paginator) {
  background: #fdfdfd;
  border: none;
  padding: 1.5rem;
  justify-content: end;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: #10b981;
  color: white;
  border-radius: 12px;
}
</style>
