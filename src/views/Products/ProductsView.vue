<template>
  <div class=" bg-[#f8fafc] pb-12">
    <div class="bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-8 py-5">
       <div class="flex items-center justify-between gap-4">
  <div class="space-y-0.5 min-w-0">
    <h1 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight truncate">
      Mahsulotlar
    </h1>
    <div class="flex items-center gap-2 text-slate-500">
      <span class="inline-flex flex-shrink-0 items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-md text-[10px] font-bold">
        {{ filteredProducts.length }}
      </span>
      <p class="text-xs md:text-sm font-medium truncate uppercase tracking-wider xs:block">
        jami mahsulotlar
      </p>
    </div>
  </div>
  
  <div class="flex items-center gap-2 flex-shrink-0">
    <Button 
      @click="openDialog"
      class="!bg-blue-600 !border-none !rounded-xl !h-11 !w-11 md:!w-auto md:!px-6 !shadow-lg !shadow-blue-200 hover:!scale-105 active:scale-95 transition-all"
    >
      <i class="pi pi-plus font-bold"></i>
      <span class="hidden md:inline ml-2 font-bold whitespace-nowrap">Yangi mahsulot</span>
    </Button>
  </div>
</div>
      </div>
    </div>

    <div class="max-w-[1600px] mx-auto px-4 sm:px-8 mt-8">
      
      <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-2 mb-8">
        <div class="flex flex-col lg:flex-row items-center gap-2">
          <div class="relative flex-1 w-full group">
            <i class="pi pi-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
            <InputText
              v-model="search"
              placeholder="Mahsulot nomi yoki kodini yozing..."
              class="w-full !pl-14 !py-4 !border-none !bg-transparent !rounded-2xl focus:!ring-0 text-slate-700"
            />
          </div>
          
          <div class="hidden lg:block w-px h-8 bg-slate-200"></div>

          <div class="w-full lg:w-72 flex items-center px-4 group">
            <i class="pi pi-map-marker text-slate-400 mr-3"></i>
            <Dropdown
              v-model="selectedFilial"
              :options="filials"
              optionLabel="name"
              optionValue="_id"
              placeholder="Barcha filiallar"
              class="w-full !border-none !shadow-none !bg-transparent group-hover:text-blue-600"
              showClear
            />
          </div>

          <div class="p-1">
             <Button 
              icon="pi pi-filter" 
              class="!bg-slate-100 !text-slate-600 !border-none !rounded-xl !h-12 !w-12"
            />
          </div>
        </div>
      </div>

      <transition name="fade-slide" mode="out-in">
        <div v-if="filteredProducts.length > 0">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            <ProductCard
              v-for="(product, index) in filteredProducts"
              :key="product._id"
              :product="product"
              :style="{ transitionDelay: `${index * 50}ms` }"
              @edit="editProduct"
              @delete="deleteProduct"
            />
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
          <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <i class="pi pi-search-minus text-4xl text-slate-300"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-2">Hech narsa topilmadi</h3>
          <p class="text-slate-500 max-w-xs text-center">
            Qidiruv so'rovini o'zgartiring yoki filtrlarni tozalab ko'ring
          </p>
          <Button 
            label="Filtrlarni tozalash" 
            link 
            class="mt-4 !font-bold" 
            @click="search = ''; selectedFilial = null" 
          />
        </div>
      </transition>
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

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Custom Scrollbar for modern look */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>