<template>
  <div class="p-4 space-y-4">
    <h1 class="text-2xl font-bold mb-4">Products</h1>

    <Button label="Yangi Product" icon="pi pi-plus" class="mb-4" @click="openDialog" />

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ProductCard
        v-for="product in products"
        :key="product._id"
        :product="product"
        @edit="editProduct"
        @delete="deleteProduct"
      />
    </div>

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
import { ref, onMounted } from "vue";
import api from "@/utils/api.js";
import Button from "primevue/button";
import ProductCard from "@/components/Products/ProductCard.vue";
import ProductDialog from "@/components/Products/ProductDialog.vue";

const products = ref([]);
const filials = ref([]);
const showDialog = ref(false);
const editingProduct = ref(null);

const units = ref([
  { label: "Dona", value: "dona" },
  { label: "Litr", value: "litr" },
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

onMounted(() => {
  fetchFilials();
  fetchProducts();
});
</script>

<style scoped></style>
