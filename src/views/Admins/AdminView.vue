<template>
  <div class="min-h-screen bg-white p-4 sm:p-4 rounded">
    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-black mb-1">Adminlar ro'yxati</h1>
          <p class="text-sm text-gray-600">Barcha adminlarni boshqarish va nazorat qilish</p>
        </div>
        <Button
          label="Yangi Admin"
          icon="pi pi-plus"
          class="bg-green-600 hover:bg-green-700 border-green-600 text-white px-6 py-2.5 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          @click="goCreate"
        />
      </div>
    </div>

    <!-- Desktop / Tablet Table -->
    <div class="max-w-7xl mx-auto hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <DataTable
        :value="admins"
        :loading="loading"
        responsiveLayout="scroll"
        :paginator="true"
        :rows="10"
        stripedRows
        class="text-sm"
      >
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-users text-4xl text-gray-300 mb-3"></i>
            <p class="text-gray-500 font-medium">Adminlar topilmadi</p>
          </div>
        </template>
        
        <Column field="fullname" header="F.I.Sh">
          <template #body="slotProps">
            <div class="flex items-center gap-3 py-1">
              <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span class="text-green-700 font-semibold text-sm">
                  {{ slotProps.data.fullname.split(' ').map(n => n[0]).join('').slice(0, 2) }}
                </span>
              </div>
              <span class="font-medium text-black">{{ slotProps.data.fullname }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="phone" header="Telefon">
          <template #body="slotProps">
            <div class="flex items-center gap-2 text-gray-700">
              <i class="pi pi-phone text-green-600 text-xs"></i>
              <span>{{ slotProps.data.phone }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="role" header="Role">
          <template #body="slotProps">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              {{ slotProps.data.role }}
            </span>
          </template>
        </Column>

        <Column header="Amallar" class="text-right">
          <template #body="slotProps">
            <div class="flex gap-2 justify-end">
              <Button
                icon="pi pi-pencil"
                class="p-button-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 w-9 h-9 transition-all duration-200"
                @click="editAdmin(slotProps.data._id)"
                v-tooltip.top="'Tahrirlash'"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-sm bg-white hover:bg-red-50 text-red-600 border border-red-200 w-9 h-9 transition-all duration-200"
                @click="confirmDelete(slotProps.data._id)"
                v-tooltip.top="'O\'chirish'"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Mobile Card View -->
    <div class="max-w-7xl mx-auto grid gap-4 md:hidden">
      <div
        v-for="admin in admins"
        :key="admin._id"
        class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex items-start gap-3 mb-4">
          <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <span class="text-green-700 font-bold text-base">
              {{ admin.fullname.split(' ').map(n => n[0]).join('').slice(0, 2) }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-black text-base mb-1">{{ admin.fullname }}</p>
            <div class="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <i class="pi pi-phone text-green-600 text-xs"></i>
              <span>{{ admin.phone }}</span>
            </div>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              {{ admin.role }}
            </span>
          </div>
        </div>

        <div class="flex gap-2 pt-3 border-t border-gray-100">
          <Button
            icon="pi pi-pencil"
            label="Tahrirlash"
            class="flex-1 p-button-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium transition-all duration-200"
            @click="editAdmin(admin._id)"
          />
          <Button
            icon="pi pi-trash"
            label="O'chirish"
            class="flex-1 p-button-sm bg-white hover:bg-red-50 text-red-600 border border-red-200 font-medium transition-all duration-200"
            @click="confirmDelete(admin._id)"
          />
        </div>
      </div>
      
      <!-- Empty state for mobile -->
      <div v-if="!loading && admins.length === 0" class="text-center py-16 bg-white rounded-lg border border-gray-200">
        <i class="pi pi-users text-5xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 font-medium mb-2">Adminlar topilmadi</p>
        <p class="text-sm text-gray-400">Yangi admin qo'shish uchun yuqoridagi tugmani bosing</p>
      </div>
    </div>
    <!--Begin Del Dialog -->
    <Dialog
  v-model:visible="deleteDialog"
  modal
  header="Adminni o‘chirish"
  :style="{ width: '90vw', maxWidth: '400px' }"
>
  <div class="space-y-3">
    <p class="text-gray-700">
      <strong>{{ selectedAdmin?.fullname }}</strong> adminni o‘chirmoqchimisiz?
    </p>
    <p class="text-sm text-red-600">
      Bu amalni ortga qaytarib bo‘lmaydi.
    </p>
  </div>

  <template #footer>
    <Button
      label="Bekor qilish"
      class="p-button-text"
      @click="deleteDialog = false"
      :disabled="deleting"
    />
    <Button
      label="O‘chirish"
      icon="pi pi-trash"
      class="bg-red-600 hover:bg-red-700 border-red-600 text-white"
      @click="deleteAdmin"
      :loading="deleting"
    />
  </template>
</Dialog>

    <!--End Del Dialog -->

    <!-- Loading state -->
    <div v-if="loading" class="max-w-7xl mx-auto flex items-center justify-center py-16">
      <i class="pi pi-spin pi-spinner text-3xl text-green-600"></i>
    </div>
  </div>
  <Toast />
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