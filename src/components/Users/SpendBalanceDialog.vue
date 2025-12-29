<script setup>
import { ref, computed, watch } from "vue";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";

import api from "@/utils/api";
import { formatCurrency } from "@/utils/formatCurrency";
import { useTransactionForm } from "@/composables/useTransactionForm";

const toast = useToast();
/* ========= Props & Emits ========= */
const props = defineProps({
  modelValue: Boolean,
  user: Object
});
const emit = defineEmits(["update:modelValue", "saved"]);

/* ========= Dialog visible ========= */
const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v)
});

/* ========= Form ========= */
const { filials, products, selectedFilial, reset } = useTransactionForm("spend");

/* ========= State ========= */
const productDialog = ref(false);
const search = ref("");
const isLoading = ref(false);

/* 🛒 BASKET */
const basket = ref([]);

/* ========= Filtered products ========= */
const filteredProducts = computed(() => {
  if (!selectedFilial.value) return [];
  if (!search.value) return products.value;
  return products.value.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

/* ========= Basket logic ========= */
const addToBasket = (product) => {
  const exist = basket.value.find(i => i.productId === product._id);
  if (exist) {
    exist.quantity++;
  } else {
    basket.value.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  productDialog.value = false;
};

const removeItem = (index) => basket.value.splice(index, 1);

/* ========= Totals ========= */
const totalAmount = computed(() =>
  basket.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
);

const remainingBalance = computed(() => {
  if (!props.user) return 0;
  return (props.user.balance || 0) - totalAmount.value;
});

const canSubmit = computed(() => {
  return (
    props.user &&
    selectedFilial.value &&
    basket.value.length > 0 &&
    remainingBalance.value >= 0
  );
});

/* ========= Reset on open ========= */
watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      reset();
      basket.value = [];
      search.value = "";
    }
  }
);

/* ========= Submit ========= */
const save = async () => {
  if (!canSubmit.value) return;

  isLoading.value = true;
  try {
    await api.post("/transactions/spend", {
      userId: props.user._id,
      filialId: selectedFilial.value._id,
      items: basket.value.map(i => ({
        productId: i.productId,
        quantity: i.quantity
      }))
    });

    emit("saved");
    visible.value = false;
    basket.value = [];
    reset();
  } catch (err){
       const audio = new Audio("../../../error.mp3"); // noto‘g‘ri scan uchun ovoz
    audio.play();
  toast.add({
  severity: "error",
  summary: "Xatolik",
  detail: `${err.response?.data?.message || err.message}`,
  life: 3000,
});
  }
  finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    style="width: 520px"
    header="Balans sarflash"
  >
    <!-- USER INFO -->
    <div
      v-if="user"
      class="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200"
    >
      <p class="text-sm text-gray-600">Foydalanuvchi</p>
      <p class="font-semibold">{{ user.fullname }}</p>
      <p class="text-sm">
        Joriy balans:
        <span class="font-bold text-blue-600">
          {{ formatCurrency(user.balance || 0) }}
        </span>
      </p>
    </div>

    <!-- FILIAL -->
    <Dropdown
      v-model="selectedFilial"
      :options="filials"
      optionLabel="name"
      placeholder="Filial tanlang"
      class="w-full mb-3"
    />

    <!-- ADD PRODUCT -->
    <Button
      label="Mahsulot qo‘shish"
      icon="pi pi-plus"
      class="w-full mb-3"
      :disabled="!selectedFilial || products.length === 0"
      @click="productDialog = true"
    />

    <!-- BASKET -->
    <div v-if="basket.length" class="space-y-2 mb-3">
      <div
        v-for="(item, i) in basket"
        :key="item.productId"
        class="flex justify-between items-center p-2 border rounded"
      >
        <div>
          <p class="font-semibold">{{ item.name }}</p>
          <p class="text-sm text-gray-500">
            {{ formatCurrency(item.price) }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <input
            type="number"
            min="1"
            v-model.number="item.quantity"
            class="w-20 px-2 py-1 border rounded"
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            @click="removeItem(i)"
          />
        </div>
      </div>
    </div>

    <!-- TOTAL / REMAIN -->
    <div
      v-if="basket.length"
      class="mb-4 p-3 rounded-lg border"
      :class="
        remainingBalance >= 0
          ? 'bg-green-50 border-green-300'
          : 'bg-red-50 border-red-300'
      "
    >
      <p>Jami sarf: <b>{{ formatCurrency(totalAmount) }}</b></p>
      <p>
        Qolgan balans:
        <span
          class="font-bold"
          :class="remainingBalance >= 0 ? 'text-green-700' : 'text-red-700'"
        >
          {{ formatCurrency(remainingBalance) }}
        </span>
      </p>
    </div>

    <!-- ACTIONS -->
    <div class="flex gap-2">
      <Button
        label="Bekor qilish"
        severity="secondary"
        class="flex-1"
        @click="visible = false"
      />
      <Button
        label="Ayirish"
        severity="danger"
        class="flex-1"
        :loading="isLoading"
        :disabled="!canSubmit"
        @click="save"
      />
    </div>
  </Dialog>

  <!-- PRODUCT SEARCH -->
  <Dialog
    v-model:visible="productDialog"
    modal
    header="Mahsulot tanlang"
    style="width: 600px"
  >
    <InputText
      v-model="search"
      placeholder="Mahsulot nomi bo‘yicha qidirish..."
      class="w-full mb-3"
    />

    <div class="max-h-96 overflow-y-auto">
      <div
        v-for="p in filteredProducts"
        :key="p._id"
        class="p-3 mb-2 border rounded cursor-pointer hover:bg-blue-50"
        @click="addToBasket(p)"
      >
        <p class="font-semibold">{{ p.name }}</p>
        <p class="text-sm text-gray-600">
          {{ formatCurrency(p.price) }}
        </p>
      </div>
    </div>
  </Dialog>
   <Toast />
</template>
