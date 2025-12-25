<template>
  <div class="">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-2">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Mahsulotlar</h1>
          <p class="text-gray-600">Saqlangan mahsulotlar ro'yxatini boshqaring va yangi mahsulot qo'shing</p>
        </div>
        <Button 
          label=" Yangi Mahsulot" 
          icon="pi pi-plus" 
          @click="openAdd"
          class="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
        />
      </div>
      <div class="h-1 w-20 bg-gradient-to-r from-green-600 to-green-400 rounded-full"></div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-lg shadow-md border border-green-100 overflow-hidden">
      <!-- Table Header Info -->
      <div class="bg-gradient-to-r from-green-50 to-white px-6 py-4 border-b border-green-100">
        <p class="text-sm text-gray-600">
          <span class="font-semibold text-green-600">{{ products.length }}</span> ta mahsulot
        </p>
      </div>

      <!-- DataTable -->
      <DataTable 
        :value="products" 
        paginator 
        :rows="10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        responsiveLayout="scroll"
        class="p-datatable-sm"
        :globalFilterFields="['name', 'unit']"
        striped-rows
      >
        <Column field="name" header="Mahsulot Nomi" class="w-1/4">
          <template #body="{ data }">
            <span class="font-medium text-gray-900">{{ data.name }}</span>
          </template>
        </Column>

        <Column field="unit" header="Birlik" class="w-1/6">
          <template #body="{ data }">
            <span class="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {{ data.unit }}
            </span>
          </template>
        </Column>

        <Column field="quantity" header="Miqdor" class="w-1/6">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full" 
                  :style="{ width: `${Math.min((data.quantity / 1000) * 100, 100)}%` }"
                ></div>
              </div>
              <span class="text-gray-900 font-semibold whitespace-nowrap">{{ data.quantity }}</span>
            </div>
          </template>
        </Column>

        <Column field="price" header="Narx" class="w-1/6">
          <template #body="{ data }">
            <div class="text-right">
              <p class="font-bold text-green-600 text-lg">{{ formatPrice(data.price) }}</p>
              <p class="text-xs text-gray-500">{{ data.unit }} uchun</p>
            </div>
          </template>
        </Column>

        <Column field="discount" header="Chegirma" class="w-1/12">
          <template #body="{ data }">
            <span v-if="data.discount > 0" class="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
              {{ data.discount }}%
            </span>
            <span v-else class="text-gray-400">—</span>
          </template>
        </Column>

        <Column header="Amallar" class="w-1/6">
          <template #body="{ data }">
            <div class="flex gap-2 justify-end">
              <Button 
                icon="pi pi-pencil" 
                @click="edit(data)"
                class="p-button-rounded p-button-text p-button-success hover:bg-green-100"
                v-tooltip="'O\'zgartirish'"
              />
              <Button 
                icon="pi pi-trash" 
                @click="remove(data._id)"
                class="p-button-rounded p-button-text p-button-danger hover:bg-red-100"
                v-tooltip="'O\'chirish'"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Empty State -->
    <div v-if="products.length === 0" class="mt-8 text-center py-12">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <i class="pi pi-inbox text-green-600 text-2xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Mahsulot topilmadi</h3>
      <p class="text-gray-600 mb-6">Yangi mahsulot qo'shish uchun tugmani bosing</p>
      <Button 
        label="Yangi Mahsulot Qo'shish" 
        icon="pi pi-plus"
        @click="openAdd"
        class="bg-green-600 hover:bg-green-700 text-white font-semibold"
      />
    </div>

    <!-- Product Dialog -->
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

const formatPrice = (price) =>
  `$${parseFloat(price).toFixed(2)}`;
</script>

<style scoped>
:deep(.p-datatable) {
  border: none;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: linear-gradient(to right, #f0fdf4, #ffffff);
  color: #1f2937;
  font-weight: 600;
  border: none;
  border-bottom: 2px solid #dbeafe;
  padding: 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  border-bottom: 1px solid #f0f4f8;
  transition: background-color 0.2s ease;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f0fdf4;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 1rem;
  color: #374151;
}

:deep(.p-paginator) {
  background: linear-gradient(to right, #f0fdf4, #ffffff);
  border: none;
  border-top: 1px solid #dbeafe;
  padding: 1rem;
}

:deep(.p-paginator .p-paginator-current) {
  color: #059669;
  font-weight: 600;
}

:deep(.p-button.p-button-success) {
  color: #059669;
}

:deep(.p-button.p-button-success:hover) {
  background-color: #ecfdf5 !important;
}

:deep(.p-button.p-button-danger:hover) {
  background-color: #fef2f2 !important;
}
</style>
