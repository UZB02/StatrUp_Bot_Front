<template>
  <div class="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
    
    <UsersHeader
      v-model:modelValue="search"
      @refresh="getUsers"
    />

    <div class="relative group" @click="setFocus">
      <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2rem] blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
      
      <div class="relative bg-white rounded-[2rem] border border-slate-100 p-2 shadow-sm flex items-center gap-3 h-[76px] cursor-text">
        <div class="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <i class="pi pi-qrcode text-2xl" :class="{ 'animate-pulse text-blue-500': isScanning }"></i>
        </div>
        
        <div class="relative flex-1 flex items-center h-full">
          <input
            ref="scanInputEl"
            v-model="scanInput"
            class="absolute opacity-0 pointer-events-none w-0 h-0"
            style="left: -1000px;"
            autocomplete="off"
          />

          <div class="flex-1">
            <div v-if="isScanning" class="flex items-center gap-2">
              <span class="text-blue-600 font-bold animate-pulse">Qidirilmoqda...</span>
            </div>
            
            <div v-else-if="scanInputDisplay" class="text-blue-500 font-bold text-lg flex items-center gap-2">
              <i class="pi pi-check-circle animate-bounce"></i>
              <span>{{ scanInputDisplay }}</span>
            </div>
            
            <div v-else class="text-slate-300 font-bold">
              QR kodni skanerlang yoki ID kiriting...
            </div>
          </div>
        </div>

        <div v-if="isScanning" class="pr-4 flex items-center gap-2">
           <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
        
        <Button 
          v-else
          icon="pi pi-bolt" 
          text 
          rounded 
          class="!text-slate-300 mr-2"
          v-tooltip.left="'Skaner kutish rejimi'"
        />
      </div>
    </div>

    <div class="relative min-h-[400px]">
      <UsersTable
        :users="users"
        :loading="loading"
        @edit="openEdit"
        @delete="deleteUser"
        @updated="onTransactionCompleted"
      />
    </div>

    <UserEditDialog v-model:visible="editDialog" :user="editUser" @save="updateUser" />

    <Dialog v-model:visible="deleteDialog" modal :closable="false" class="w-[95vw] max-w-[420px] !rounded-[2.5rem] !border-none !overflow-hidden shadow-2xl">
      <div class="p-4 text-center">
        <div class="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <i class="pi pi-exclamation-triangle text-3xl"></i>
        </div>
        <h3 class="text-xl font-black text-slate-900 mb-2">Foydalanuvchini o‘chirish</h3>
        <p class="text-slate-500 font-medium mb-6">
          <span class="font-black text-slate-800">"{{ selectedUser?.fullname }}"</span> hisobi o‘chiriladi.
        </p>
        <div class="flex gap-3">
          <Button label="Bekor qilish" text class="flex-1 !py-4 !rounded-2xl !font-bold !text-slate-400" @click="deleteDialog = false" />
          <Button label="O‘chirish" severity="danger" class="flex-1 !py-4 !rounded-2xl !bg-rose-500 !border-none !text-white !font-black" :loading="deleting" @click="deleteUsermain" />
        </div>
      </div>
    </Dialog>

    <Toast position="bottom-right" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import api from "@/utils/api.js";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Toast from 'primevue/toast';

import UsersHeader from "@/components/Users/UsersHeader.vue";
import UsersTable from "@/components/Users/UsersTable.vue";
import UserEditDialog from "@/components/Users/UserEditDialog.vue";

const users = ref([]);
const loading = ref(false);
const search = ref("");
const scanInput = ref("");
const scanInputDisplay = ref(""); 
const isScanning = ref(false);
const scanInputEl = ref(null);

const editDialog = ref(false);
const editUser = ref({});
const deleteDialog = ref(false);
const deleting = ref(false);
const selectedUser = ref(null);

const toast = useToast();

const setFocus = () => {
  scanInputEl.value?.focus();
};

const getUsers = async () => {
  try {
    loading.value = true;
    const { data } = await api.get("/users");
    users.value = data;
  } catch {
    toast.add({ severity: "error", summary: "Xatolik", detail: "Foydalanuvchilar yuklanmadi", life: 3000 });
  } finally { loading.value = false; }
};

/* 🔹 REAL-TIME SEARCH (YUQORI QISMDAGI SEARCH UCHUN) */
let timeout;
watch(search, (val) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (!val) return getUsers();
    findUser(val);
  }, 1200);
});

/* 🔹 FIND USER */
const findUser = async (query, type = null) => {
  try {
    loading.value = true;
    let params = {};

    if (type === "userId") params.userId = query;
    else if (query.startsWith("+") || query.startsWith("998")) params.phone = query;
    else if (/^[A-Za-z\s]+$/.test(query)) params.fullname = query;
    else if (/^\d{8,20}$/.test(query)) params.cardNumber = query; // ✅ Faqat raqam (8-20 xona)
    else params.autoNumber = query;

    const { data } = await api.get("/users/find", { params });
    users.value = [data];
    new Audio("/beep.mp3").play().catch(() => {});

    setTimeout(() => {
      scanInputDisplay.value = "";
    }, 2000);

  } catch (err) {
    users.value = [];
    new Audio("/error.mp3").play().catch(() => {});
    scanInputDisplay.value = "";
    toast.add({ severity: "error", summary: "Xatolik", detail: "Foydalanuvchi topilmadi", life: 3000 });
  } finally {
    loading.value = false;
  }
};

/* 🔹 SCANNER LOGIC */
let scanTimeout = null;
watch(scanInput, (val) => {
  if (!val || isScanning.value) return;

  clearTimeout(scanTimeout);
  scanTimeout = setTimeout(async () => {
    const rawData = scanInput.value.trim();
    if (rawData.length < 10) return;

    isScanning.value = true;
    const tempVal = rawData;
    scanInput.value = ""; 

    try {
      let userId = null;
      try {
        const parsed = JSON.parse(tempVal);
        userId = parsed.userId;
      } catch (e) {
        const match = tempVal.match(/userId[^a-f\d]+([a-f\d]{24})/i);
        if (match && match[1]) userId = match[1];
      }

      if (userId) {
        // Operatorga qaysi ID topilganini bildirish uchun qisqa matn
        scanInputDisplay.value = "Topildi: " + userId.substring(0, 8) + "...";
        await findUser(userId, "userId");
      } else {
        isScanning.value = false;
        scanInput.value = "";
      }
    } finally {
      isScanning.value = false;
      await nextTick();
      setFocus();
    }
  }, 150); 
});

const openEdit = (user) => { editUser.value = { ...user }; editDialog.value = true; };
const updateUser = async (user) => {
  try {
    await api.put(`/users/${user._id}`, user);
    toast.add({ severity: "success", summary: "Saqlandi", life: 3000 });
    editDialog.value = false;
    getUsers();
  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: "Saqlanmadi", life: 3000 });
  }
};

const deleteUser = (user) => { selectedUser.value = user; deleteDialog.value = true; };
const deleteUsermain = async () => {
  deleting.value = true;
  try {
    await api.delete(`/users/${selectedUser.value._id}`);
    toast.add({ severity: "success", summary: "O‘chirildi", life: 3000 });
    deleteDialog.value = false;
    getUsers();
  } finally {
    deleting.value = false;
    selectedUser.value = null;
  }
};

const onTransactionCompleted = () => getUsers();

onMounted(async () => {
  await getUsers();
  setFocus();
});
</script>

<style scoped>
:deep(.p-dialog-mask) { backdrop-filter: blur(4px); }
:deep(.p-dialog-content) { padding: 2rem !important; }
</style>