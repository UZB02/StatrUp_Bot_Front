<template>
  <Dialog
    :header="editingProduct ? 'Productni tahrirlash' : 'Yangi Product'"
    :visible="visible"
    @update:visible="$emit('close')" 
    :modal="true"
    :closable="false"
    class="w-96"
  >
    <form @submit.prevent="onSubmit" class="space-y-3">
      <div>
        <label class="block mb-1 font-medium">Nomi</label>
        <InputText v-model="form.name" required />
      </div>

      <div>
        <label class="block mb-1 font-medium">Filial</label>
        <Select
          v-model="form.filial"
          :options="filials"
          option-label="name"
          option-value="_id"
          placeholder="Filial tanlang"
          required
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Birlik</label>
        <Select
          v-model="form.unit"
          :options="units"
          option-label="label"
          option-value="value"
          placeholder="Birlik tanlang"
          required
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">
          Narx ({{ form.unit === 'dona' ? '1 dona' : '1 litr' }} uchun)
        </label>
        <InputNumber
          v-model="form.price"
          mode="currency"
          currency="USD"
          locale="en-US"
          :min="0"
          required
          class="w-full"
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Chegirma (%)</label>
        <InputNumber v-model="form.discount" :min="0" :max="100" suffix="%" class="w-full" />
      </div>

      <div class="flex justify-end gap-2 mt-3">
        <Button label="Bekor qilish" class="p-button-secondary" @click="$emit('close')" />
        <Button label="Saqlash" type="submit" />
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import Button from "primevue/button";

const props = defineProps({
  visible: Boolean,
  editingProduct: Object,
  filials: Array,
  units: Array
});

const emits = defineEmits(["save", "close"]);

const form = ref({
  name: "",
  filial: null,
  unit: "dona",
  price: 0,
  discount: 0,
});

watch(
  () => props.editingProduct,
  (newVal) => {
    if (newVal) {
      form.value = {
        name: newVal.name,
        filial: newVal.filial._id,
        unit: newVal.unit,
        price: newVal.price,
        discount: newVal.discount,
      };
    } else {
      form.value = { name: "", filial: null, unit: "dona", price: 0, discount: 0 };
    }
  },
  { immediate: true }
);

const onSubmit = () => {
  emits("save", { ...form.value });
};
</script>

<style scoped></style>
