<template>
  <div class=" bg-[#f8fafc] pb-12">
    <div class=" bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-8 py-5">
        <div class="flex items-center justify-between gap-4">
          <div class="space-y-1">
            <h1 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Adminlar</h1>
            <div class="flex items-center gap-2 text-slate-500">
              <span class="inline-flex items-center justify-center px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                {{ admins.length }} nafar
              </span>
              <p class="text-xs md:text-sm font-medium hidden sm:block italic">tizim boshqaruvchilari</p>
            </div>
          </div>
          
          <Button 
            @click="goCreate"
            class="!bg-emerald-600 !border-none !rounded-2xl !h-12 !w-12 md:!w-auto md:!px-6 !shadow-lg !shadow-emerald-200 hover:!scale-105 active:scale-95 transition-all"
          >
            <i class="pi pi-plus font-bold"></i>
            <span class="hidden md:inline ml-2 font-bold whitespace-nowrap text-white">Yangi Admin</span>
          </Button>
        </div>
      </div>
    </div>

    <div class="max-w-[1400px] mx-auto px-4 sm:px-8 mt-8">
      
      <div class="hidden md:block bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <DataTable
          :value="admins"
          :loading="loading"
          responsiveLayout="scroll"
          :paginator="admins.length > 10"
          :rows="10"
          class="p-datatable-modern"
        >
          <template #empty>
            <div class="text-center py-20">
              <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="pi pi-users text-3xl text-slate-300"></i>
              </div>
              <p class="text-slate-500 font-bold">Hozircha adminlar mavjud emas</p>
            </div>
          </template>
          
          <Column header="F.I.Sh" class="w-[40%]">
            <template #body="{ data }">
              <div class="flex items-center gap-4 py-2">
                <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-100 ring-2 ring-white">
                  <span class="text-white font-bold text-sm tracking-tighter">
                    {{ data.fullname.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <div class="font-bold text-slate-800 leading-none mb-1">{{ data.fullname }}</div>
                  <div class="text-[11px] font-bold text-emerald-600 uppercase tracking-widest opacity-70">ID: {{ data._id.slice(-6) }}</div>
                </div>
              </div>
            </template>
          </Column>
          
          <Column header="Bog'lanish">
            <template #body="{ data }">
              <div class="flex items-center gap-2 group">
                <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                   <i class="pi pi-phone text-xs"></i>
                </div>
                <span class="text-sm font-semibold text-slate-600">{{ data.phone }}</span>
              </div>
            </template>
          </Column>
          
          <Column header="Darajasi (Role)">
            <template #body="{ data }">
              <span class="inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tighter bg-slate-100 text-slate-600 border border-slate-200/50"
                    :class="{'!bg-blue-50 !text-blue-600 !border-blue-100': data.role === 'admin'}">
                <i class="pi pi-shield mr-1.5 text-[10px]"></i>
                {{ data.role }}
              </span>
            </template>
          </Column>

          <Column header="Boshqaruv" class="text-right">
            <template #body="{ data }">
              <div class="flex gap-2 justify-end">
                <Button
                  icon="pi pi-pencil"
                  @click="editAdmin(data._id)"
                  class="!w-10 !h-10 !rounded-xl !bg-slate-50 !text-slate-600 !border-none hover:!bg-amber-50 hover:!text-amber-600 transition-all"
                  v-tooltip.top="'Tahrirlash'"
                />
                <Button
                  icon="pi pi-trash"
                  @click="confirmDelete(data)"
                  class="!w-10 !h-10 !rounded-xl !bg-slate-50 !text-slate-400 !border-none hover:!bg-rose-50 hover:!text-rose-600 transition-all"
                  v-tooltip.top="'O\'chirish'"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <div class="grid gap-4 md:hidden">
        <div v-for="admin in admins" :key="admin._id" 
             class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
               <div class="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold">
                  {{ admin.fullname.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() }}
               </div>
               <div>
                 <h3 class="font-bold text-slate-900 leading-tight">{{ admin.fullname }}</h3>
                 <span class="text-xs font-bold text-emerald-500 uppercase tracking-widest">{{ admin.role }}</span>
               </div>
            </div>
          </div>
          
          <div class="flex items-center gap-3 py-3 px-4 bg-slate-50 rounded-2xl mb-4">
            <i class="pi pi-phone text-slate-400"></i>
            <span class="text-sm font-bold text-slate-700">{{ admin.phone }}</span>
          </div>

          <div class="flex gap-3">
            <Button icon="pi pi-pencil" label="Tahrirlash" @click="editAdmin(admin._id)" 
                    class="flex-1 !bg-slate-100 !text-slate-700 !border-none !rounded-xl !py-3 font-bold" />
            <Button icon="pi pi-trash" @click="confirmDelete(admin)" 
                    class="!bg-rose-50 !text-rose-500 !border-none !rounded-xl !w-14" />
          </div>
        </div>
      </div>
    </div>

    <Dialog v-model:visible="deleteDialog" modal :closable="false"
            class="w-[90vw] max-w-[400px] !rounded-[2.5rem] !overflow-hidden !border-none shadow-2xl">
      <div class="p-4 text-center">
        <div class="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="pi pi-exclamation-triangle text-3xl text-rose-500"></i>
        </div>
        <h3 class="text-xl font-black text-slate-900 mb-2">Ishonchingiz komilmi?</h3>
        <p class="text-slate-500 text-sm leading-relaxed mb-8">
          Siz <span class="font-bold text-slate-800">{{ selectedAdmin?.fullname }}</span> ismli adminni o'chirmoqchisiz. Bu amalni qaytarib bo'lmaydi.
        </p>
        <div class="flex flex-col gap-3">
          <Button label="Ha, o'chirilsin" @click="deleteAdmin" :loading="deleting"
                  class="!bg-rose-500 !border-none !rounded-2xl !py-4 font-bold !text-white" />
          <Button label="Bekor qilish" @click="deleteDialog = false"
                  class="!text-slate-400 !font-bold hover:!bg-slate-50 !rounded-2xl !py-3" text />
        </div>
      </div>
    </Dialog>

    <Toast />
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/utils/api";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const router = useRouter();
const admins = ref([]);
const loading = ref(false);

const deleteDialog = ref(false);
const selectedAdmin = ref(null);
const deleting = ref(false);


const fetchAdmins = async () => {
  loading.value = true;
  try {
    const res = await api.get("/admin");
    admins.value = res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Xatolik yuz berdi");
  } finally {
    loading.value = false;
  }
};

const goCreate = () => router.push("/admins/create");
const editAdmin = (id) => router.push(`/admins/edit/${id}`);

const confirmDelete = (admin) => {
  selectedAdmin.value = admin;
  deleteDialog.value = true;
};


const deleteAdmin = async () => {
  if (!selectedAdmin.value) return;
  deleting.value = true;
  console.log(selectedAdmin.value._id);
  try {
    await api.delete(`/admin/${selectedAdmin.value}`);
    deleteDialog.value = false;
    selectedAdmin.value = null;
    toast.add({ severity: 'success', summary: 'Muvoffaqqiyatli', detail: 'Admin o\'chirildi', life: 3000 });
    fetchAdmins();
  } catch (err) {
    console.error(err);
    toast.add({ severity: 'error', summary: 'Xatolik', detail: `${err.response?.data?.message || 'O\'chirishda xatolik'}`, life: 3000 });
  } finally {
    deleting.value = false;
  }
};


onMounted(fetchAdmins);
</script>
<style scoped>
/* PrimeVue DataTable custom styling */
:deep(.p-datatable-modern .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1.5rem 1rem;
  border: none;
}

:deep(.p-datatable-modern .p-datatable-tbody > tr) {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

:deep(.p-datatable-modern .p-datatable-tbody > tr:hover) {
  background: #fdfdfd;
}

:deep(.p-datatable-modern .p-datatable-tbody > tr > td) {
  padding: 1rem;
  border: none;
}

/* Pagination styling */
:deep(.p-paginator) {
  border: none;
  background: transparent;
  padding-top: 1rem;
}
</style>