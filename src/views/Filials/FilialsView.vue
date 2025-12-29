<template>
  <div class="">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Filiallar</h1>
      <Button
        label="Filial qo‘shish"
        icon="pi pi-plus"
        severity="success"
        @click="openCreateDialog"
      />
    </div>

    <!-- Filiallar Table -->
    <DataTable
      :value="filials"
      dataKey="_id"
      stripedRows
      responsiveLayout="scroll"
      emptyMessage="Filiallar topilmadi"
    >
      <Column field="name" header="Nomi" />
      <Column field="region" header="Viloyat" />
      <Column field="address" header="Manzil" />
      <Column header="Ish vaqti">
        <template #body="{ data }">
          <span>{{ data.workingHours.start }} - {{ data.workingHours.end }}</span>
        </template>
      </Column>
      <Column header="Holat">
        <template #body="{ data }">
          <Tag
            :value="data.isActive ? 'Aktiv' : 'Noaktiv'"
            :severity="data.isActive ? 'success' : 'danger'"
          />
        </template>
      </Column>
      <Column header="Amallar">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              icon="pi pi-eye"
              size="small"
              severity="info"
              @click="$router.push(`/filials/${data._id}`)"
            />
            <Button
              icon="pi pi-pencil"
              size="small"
              severity="warning"
              @click="openEditDialog(data)"
            />
            <Button
              icon="pi pi-trash"
              size="small"
              severity="danger"
              @click="confirmDelete(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Create / Edit Dialog -->
    <Dialog
      v-model:visible="filialDialog"
      modal
      :header="editing ? 'Filialni tahrirlash' : 'Yangi filial'"
      class="w-full max-w-lg"
    >
      <div class="space-y-4">
        <InputText v-model="form.name" placeholder="Filial nomi" class="w-full" />
        
        <!-- Viloyat -->
        <Dropdown
          v-model="form.region"
          :options="regions"
          optionLabel="name"
          placeholder="Viloyatni tanlang"
          class="w-full"
        />

        <InputText v-model="form.address" placeholder="Manzil" class="w-full" />

        <!-- Ish vaqti -->
        <div class="flex gap-2">
          <InputText
            v-model="form.workingHours.start"
            placeholder="Boshlanish vaqti (HH:MM)"
            class="w-1/2"
          />
          <InputText
            v-model="form.workingHours.end"
            placeholder="Tugash vaqti (HH:MM)"
            class="w-1/2"
          />
        </div>

        <!-- Aktiv holat -->
        <div class="flex items-center gap-2">
          <Checkbox v-model="form.isActive" binary />
          <label>Aktiv</label>
        </div>

        <!-- Joylashuv -->
        <div class="space-y-2">
          <label class="font-medium">Joylashuv (Latitude & Longitude)</label>
          <div class="flex gap-2">
            <InputText
              v-model.number="form.location.coordinates[1]"
              placeholder="Latitude"
              class="w-1/2"
            />
            <InputText
              v-model.number="form.location.coordinates[0]"
              placeholder="Longitude"
              class="w-1/2"
            />
          </div>

          <!-- Google Maps preview -->
          <div v-if="form.location.coordinates[0] && form.location.coordinates[1]" class="h-64 w-full">
            <iframe
              :src="mapUrl"
              width="100%"
              height="100%"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Bekor qilish" text @click="filialDialog = false" />
        <Button label="Saqlash" @click="saveFilial" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/utils/api.js";

/* PrimeVue Components */
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import Tag from "primevue/tag";
import Dropdown from "primevue/dropdown";

/* State */
const filials = ref([]);
const filialDialog = ref(false);
const editing = ref(false);
const selectedFilial = ref(null);

const form = ref({
  name: "",
  region: null,
  address: "",
  isActive: true,
  workingHours: { start: "09:00", end: "18:00" },
  location: { type: "Point", coordinates: [0, 0] },
});

/* Viloyatlar ro‘yxati */
const regions = [
  { name: "Namangan" },
  { name: "Andijon" },
  { name: "Farg'ona" },
  { name: "Samarqand" },
  { name: "Toshkent" },
  { name: "Buxoro" },
  { name: "Xorazm" },
  { name: "Qashqadaryo" },
  { name: "Surxondaryo" },
  { name: "Jizzax" },
  { name: "Sirdaryo" },
  { name: "Navoiy" },
  { name: "Toshkent shahar" },
  { name: "Qoraqalpog‘iston" },
];

/* Google Maps URL */
const mapUrl = computed(() => {
  const lat = form.value.location.coordinates[1];
  const lng = form.value.location.coordinates[0];
  return `https://www.google.com/maps?q=${lat},${lng}&hl=ru&z=15&output=embed`;
});

/* API Load */
const loadFilials = async () => {
  try {
    const res = await api.get("/filials");
    filials.value = res.data;
  } catch (e) {
    console.error("Filiallarni yuklashda xato", e);
  }
};

/* Actions */
const openCreateDialog = () => {
  editing.value = false;
  form.value = {
    name: "",
    region: null,
    address: "",
    isActive: true,
    workingHours: { start: "09:00", end: "18:00" },
    location: { type: "Point", coordinates: [0, 0] },
  };
  filialDialog.value = true;
};

const openEditDialog = (filial) => {
  editing.value = true;
  selectedFilial.value = filial;
  form.value = {
    name: filial.name,
    region: regions.find(r => r.name === filial.region) || null,
    address: filial.address,
    isActive: filial.isActive,
    workingHours: { ...filial.workingHours },
    location: { ...filial.location },
  };
  filialDialog.value = true;
};

const saveFilial = async () => {
  try {
    if (!form.value.region) {
      alert("Viloyatni tanlang");
      return;
    }

    // payload tayyorlash: region string sifatida
    const payload = {
      ...form.value,
      region: form.value.region.name
    };

    if (editing.value) {
      await api.put(`/filials/${selectedFilial.value._id}`, payload);
    } else {
      await api.post("/filials", payload);
    }

    filialDialog.value = false;
    loadFilials();
  } catch (e) {
    alert("Saqlashda xato yuz berdi");
    console.error(e);
  }
};

const confirmDelete = async (filial) => {
  if (!confirm("Filial o‘chirilsinmi?")) return;
  await api.delete(`/filials/${filial._id}`);
  loadFilials();
};

onMounted(loadFilials);
</script>

<style scoped></style>
