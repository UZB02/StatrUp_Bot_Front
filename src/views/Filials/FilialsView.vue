<template>
  <div class="bg-[#f8fafc] pb-12">
    <div class="bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-8 py-5">
        <div class="flex items-center justify-between gap-4">
          <div class="space-y-1">
            <h1 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Filiallar</h1>
            <div class="flex items-center gap-2 text-slate-500">
              <i class="pi pi-map-marker text-emerald-500 text-xs"></i>
              <p class="text-xs md:text-sm font-medium italic">Hududiy tarmoqlarni boshqarish</p>
            </div>
          </div>
          
          <Button 
            @click="openCreateDialog"
            class="!bg-emerald-600 !border-none !rounded-2xl !h-12 !w-12 md:!w-auto md:!px-6 !shadow-lg !shadow-emerald-200 hover:!scale-105 active:scale-95 transition-all"
          >
            <i class="pi pi-plus font-bold text-white"></i>
            <span class="hidden md:inline ml-2 font-bold whitespace-nowrap text-white">Yangi Filial</span>
          </Button>
        </div>
      </div>
    </div>

    <div class="max-w-[1400px] mx-auto px-4 sm:px-8 mt-8">
      
      <div class="hidden md:block bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <DataTable
          :value="filials"
          dataKey="_id"
          stripedRows
          class="p-datatable-modern"
          emptyMessage="Filiallar topilmadi"
        >
          <Column field="name" header="Filial Nomi" class="font-bold text-slate-800" />
          
          <Column header="Joylashuv">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-sm font-bold text-slate-700">{{ data.region }}</span>
                <span class="text-xs text-slate-400 truncate max-w-[200px]">{{ data.address }}</span>
              </div>
            </template>
          </Column>

          <Column header="Ish Vaqti">
            <template #body="{ data }">
              <div class="inline-flex items-center px-3 py-1 bg-slate-50 rounded-xl border border-slate-100">
                <i class="pi pi-clock mr-2 text-blue-500 text-xs"></i>
                <span class="text-xs font-bold text-slate-600">{{ data.workingHours.start }} - {{ data.workingHours.end }}</span>
              </div>
            </template>
          </Column>

          <Column header="Holat">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <div :class="['w-2 h-2 rounded-full animate-pulse', data.isActive ? 'bg-emerald-500' : 'bg-rose-500']"></div>
                <span :class="['text-[10px] font-black uppercase tracking-widest', data.isActive ? 'text-emerald-600' : 'text-rose-600']">
                  {{ data.isActive ? 'Aktiv' : 'Noaktiv' }}
                </span>
              </div>
            </template>
          </Column>

          <Column header="Amallar" class="text-right">
            <template #body="{ data }">
              <div class="flex gap-2 justify-end">
                <Button icon="pi pi-eye" @click="$router.push(`/filials/${data._id}`)" 
                        class="!w-9 !h-9 !rounded-xl !bg-blue-50 !text-blue-600 !border-none hover:!bg-blue-100 transition-all" />
                <Button icon="pi pi-pencil" @click="openEditDialog(data)" 
                        class="!w-9 !h-9 !rounded-xl !bg-amber-50 !text-amber-600 !border-none hover:!bg-amber-100 transition-all" />
                <Button icon="pi pi-trash" @click="confirmDelete(data)" 
                        class="!w-9 !h-9 !rounded-xl !bg-rose-50 !text-rose-600 !border-none hover:!bg-rose-100 transition-all" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <div class="grid gap-4 md:hidden">
        <div v-for="filial in filials" :key="filial._id" 
             class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-black text-slate-900 text-lg">{{ filial.name }}</h3>
              <p class="text-xs text-slate-400 font-medium">{{ filial.region }}</p>
            </div>
            <div :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter', filial.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600']">
              {{ filial.isActive ? 'Aktiv' : 'Yopiq' }}
            </div>
          </div>
          
          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-3 text-slate-600">
              <i class="pi pi-map-marker text-xs"></i>
              <span class="text-xs font-medium truncate">{{ filial.address }}</span>
            </div>
            <div class="flex items-center gap-3 text-slate-600">
              <i class="pi pi-clock text-xs"></i>
              <span class="text-xs font-bold">{{ filial.workingHours.start }} - {{ filial.workingHours.end }}</span>
            </div>
          </div>

          <div class="flex gap-2 pt-4 border-t border-slate-50">
            <Button icon="pi pi-eye" class="flex-1 !rounded-xl !bg-slate-50 !text-slate-600 !border-none" @click="$router.push(`/filials/${filial._id}`)" />
            <Button icon="pi pi-pencil" class="flex-1 !rounded-xl !bg-slate-50 !text-slate-600 !border-none" @click="openEditDialog(filial)" />
            <Button icon="pi pi-trash" class="!w-12 !rounded-xl !bg-rose-50 !text-rose-500 !border-none" @click="confirmDelete(filial)" />
          </div>
        </div>
      </div>
    </div>

    <Dialog 
      v-model:visible="filialDialog" 
      modal 
      :header="editing ? 'Filial Ma\'lumotlari' : 'Yangi Filial Qo\'shish'"
      class="w-[95vw] max-w-2xl !rounded-[2.5rem] !overflow-hidden"
    >
      <div class="p-2 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Filial Nomi</label>
            <InputText v-model="form.name" placeholder="Masalan: Chilonzor filiali" class="w-full !rounded-2xl !bg-slate-50 !border-none !py-4" />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Viloyat</label>
            <Dropdown v-model="form.region" :options="regions" optionLabel="name" optionValue="name" placeholder="Tanlang" class="w-full !rounded-2xl !bg-slate-50 !border-none !py-1" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">To'liq Manzil</label>
          <InputText v-model="form.address" placeholder="Ko'cha, uy raqami, mo'ljal..." class="w-full !rounded-2xl !bg-slate-50 !border-none !py-4" />
        </div>

        <div class="flex flex-wrap items-end gap-6 bg-slate-50 p-6 rounded-[2rem]">
          <div class="space-y-2 flex-1 min-w-[200px]">
            <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ish Vaqti</label>
            <div class="flex items-center gap-2">
              <InputText v-model="form.workingHours.start" placeholder="09:00" class="w-full !rounded-xl !border-slate-200" />
              <span class="text-slate-300">-</span>
              <InputText v-model="form.workingHours.end" placeholder="21:00" class="w-full !rounded-xl !border-slate-200" />
            </div>
          </div>
          <div class="flex items-center gap-3 pb-3">
             <InputSwitch v-model="form.isActive" />
             <span class="text-sm font-bold text-slate-600">Filial holati: {{ form.isActive ? 'Aktiv' : 'Noaktiv' }}</span>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Xaritadagi joylashuv (Geo)</label>
            <div class="flex gap-2">
               <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Lat: {{ form.location.coordinates[1] || '0' }}</span>
               <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Lng: {{ form.location.coordinates[0] || '0' }}</span>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
             <InputText v-model.number="form.location.coordinates[1]" placeholder="Latitude" class="w-full !rounded-xl !text-xs" />
             <InputText v-model.number="form.location.coordinates[0]" placeholder="Longitude" class="w-full !rounded-xl !text-xs" />
          </div>

          <div class="relative h-60 w-full rounded-[2rem] overflow-hidden border-4 border-slate-50 group shadow-inner">
            <div v-if="!form.location.coordinates[0]" class="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center text-slate-400">
               <i class="pi pi-map text-3xl mb-2"></i>
               <p class="text-xs font-medium">Koordinatalarni kiriting...</p>
            </div>
            <iframe v-else :src="mapUrl" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3 w-full pt-4">
          <Button label="Bekor qilish" text @click="filialDialog = false" class="flex-1 !text-slate-400 font-bold" />
          <Button label="Filialni saqlash" @click="saveFilial" class="flex-[2] !bg-emerald-600 !border-none !rounded-2xl !py-4 font-bold !shadow-lg !shadow-emerald-100" />
        </div>
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
<style scoped>
:deep(.p-datatable-modern .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 1.5rem 1rem;
  border: none;
}

:deep(.p-datatable-modern .p-datatable-tbody > tr) {
  border-bottom: 1px solid #f1f5f9;
}

:deep(.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider) {
  background: #10b981;
}

:deep(.p-dialog-header) {
  padding: 2rem 2rem 1rem;
}

:deep(.p-dialog-content) {
  padding: 0 2rem 2rem;
}
</style>
