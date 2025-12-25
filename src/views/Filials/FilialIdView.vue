<template>
  <div class="p-6 space-y-6">
    <FilialInfo :filial="filial" />

    <FilialAdmins
      :admins="admins"
      :allAdmins="allAdmins"
      :filialId="filialId"
      @refresh="loadAdmins"
    />

    <FilialProducts
      :products="products"
      :filialId="filialId"
      @refresh="loadProducts"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "@/utils/api";

/* components */
import FilialInfo from "../../components/FilialDetails/FilialInfo.vue";
import FilialAdmins from "../../components/FilialDetails/FilialAdmins.vue";
import FilialProducts from "../../components/FilialDetails/FilialProducts.vue";

const route = useRoute();
const filialId = route.params.id;

const filial = ref({});
const admins = ref([]);
const allAdmins = ref([]);
const products = ref([]);

/* loaders */
const loadFilial = async () => {
  const res = await api.get(`/filials/${filialId}`);
  filial.value = res.data;
};

const loadAdmins = async () => {
  const res = await api.get(`/filials/${filialId}/admins`);
  admins.value = res.data;
};

const loadAllAdmins = async () => {
  const res = await api.get("/admin");
  allAdmins.value = res.data;
};

const loadProducts = async () => {
  const res = await api.get("/products");
  products.value = res.data.filter(p => p.filial?._id === filialId);
};

onMounted(() => {
  loadFilial();
  loadAdmins();
  loadAllAdmins();
  loadProducts();
});
</script>
