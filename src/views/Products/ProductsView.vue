<template>
  <div class="">
    <!-- Header Section -->
    <div class="border-b border-slate-200 bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-slate-900 text-balance">Mahsulotlar</h1>
            <p class="text-slate-500 text-sm mt-2">Barcha mahsulotlarni boshqaring va filter qiling</p>
          </div>
          <Button 
            label="Yangi Mahsulot" 
            icon="pi pi-plus" 
            class="p-button-lg"
            @click="openDialog"
          />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class=" mx-auto">
      <!-- Filters Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8 border border-slate-200">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2 mb-2">
            <i class="pi pi-sliders-v text-slate-600"></i>
            <h2 class="font-semibold text-slate-900">Filtrlar</h2>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-slate-700">Mahsulot nomi</label>
              <InputText
                v-model="search"
                placeholder="Qidirish..."
                class="w-full"
              />
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-slate-700">Filial bo'yicha</label>
              <Dropdown
                v-model="selectedFilial"
                :options="filials"
                optionLabel="name"
                optionValue="_id"
                placeholder="Barcha filiallar"
                class="w-full"
                showClear
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Results Info -->
      <div class="mb-6 flex items-center justify-between">
        <div class="text-sm text-slate-600">
          <span class="font-semibold text-slate-900">{{ filteredProducts.length }}</span>
          <span> ta mahsulot topildi</span>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product._id"
          :product="product"
          @edit="editProduct"
          @delete="deleteProduct"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-16">
        <i class="pi pi-inbox text-6xl text-slate-300 mb-4"></i>
        <h3 class="text-lg font-semibold text-slate-900 mb-2">Mahsulot topilmadi</h3>
        <p class="text-slate-500 text-sm">Filtrlarni o'zgartirib ko'ring yoki yangi mahsulot qo'shing</p>
      </div>
    </div>

    <!-- Dialog -->
    <ProductDialog
      :visible="showDialog"
      :editing-product="editingProduct"
      :filials="filials"
      :units="units"
      @save="saveProduct"
      @close="closeDialog"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/utils/api.js";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import ProductCard from "@/components/Products/ProductCard.vue";
import ProductDialog from "@/components/Products/ProductDialog.vue";

const products = ref([]);
const filials = ref([]);
const showDialog = ref(false);
const editingProduct = ref(null);
const search = ref("");
const selectedFilial = ref(null);

const units = ref([
  { label: "Dona", value: "dona" },
  { label: "Litr", value: "litr" },
  { label: "Kg", value: "kg" },
]);

const fetchProducts = async () => {
  try {
    const res = await api.get("/products");
    products.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const fetchFilials = async () => {
  try {
    const res = await api.get("/filials");
    filials.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const openDialog = () => {
  editingProduct.value = null;
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
  editingProduct.value = null;
};

const editProduct = (product) => {
  editingProduct.value = product;
  showDialog.value = true;
};

const deleteProduct = async (id) => {
  if (!confirm("Productni o'chirmoqchimisiz?")) return;
  try {
    await api.delete(`/products/${id}`);
    fetchProducts();
  } catch (err) {
    console.error(err);
    alert("O'chirishda xatolik yuz berdi");
  }
};

const saveProduct = async (data) => {
  try {
    if (editingProduct.value) {
      await api.put(`/products/${editingProduct.value._id}`, data);
    } else {
      await api.post("/products", data);
    }
    closeDialog();
    fetchProducts();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Xatolik yuz berdi!");
  }
};

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesName = product.name.toLowerCase().includes(search.value.toLowerCase());
    const matchesFilial = selectedFilial.value ? product.filial._id === selectedFilial.value : true;
    return matchesName && matchesFilial;
  });
});

onMounted(() => {
  fetchFilials();
  fetchProducts();
});
</script>

<style scoped></style>
