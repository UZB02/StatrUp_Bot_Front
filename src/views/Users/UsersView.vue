<template>
  <div class="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
    
    <UsersHeader
      v-model:modelValue="search"
      @refresh="getUsers"
    />

    <div class="relative group">
      <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2rem] blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
      
      <div class="relative bg-white rounded-[2rem] border border-slate-100 p-2 shadow-sm flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <i class="pi pi-qrcode text-2xl" :class="{ 'animate-pulse text-blue-500': isScanning }"></i>
        </div>
        
        <InputText
          v-model="scanInput"
          placeholder="QR kodni skanerlang yoki ID kiriting..."
          class="flex-1 !border-none !shadow-none !bg-transparent !py-4 font-bold text-slate-700 placeholder:text-slate-300 focus:!ring-0"
          :readonly="isScanning"
          ref="scanInputEl"
        />

        <div v-if="isScanning" class="pr-4 flex items-center gap-2">
           <span class="text-[10px] font-black text-blue-500 uppercase tracking-widest animate-pulse">Skanerlanmoqda...</span>
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

    <UserEditDialog
      v-model:visible="editDialog"
      :user="editUser"
      @save="updateUser"
    />

    <Dialog
      v-model:visible="deleteDialog"
      modal
      :closable="false"
      class="w-[95vw] max-w-[420px] !rounded-[2.5rem] !border-none !overflow-hidden shadow-2xl"
    >
      <div class="p-4 text-center">
        <div class="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <i class="pi pi-exclamation-triangle text-3xl"></i>
        </div>
        
        <h3 class="text-xl font-black text-slate-900 mb-2">Foydalanuvchini o‘chirish</h3>
        <p class="text-slate-500 font-medium mb-6">
          <span class="font-black text-slate-800">"{{ selectedUser?.fullname }}"</span> 
          hisobi tizimdan butunlay o‘chiriladi. Bu amalni ortga qaytarib bo‘lmaydi.
        </p>

        <div class="flex gap-3">
          <Button 
            label="Bekor qilish" 
            text 
            class="flex-1 !py-4 !rounded-2xl !font-bold !text-slate-400" 
            @click="deleteDialog = false" 
          />
          <Button
            label="O‘chirish"
            severity="danger"
            class="flex-1 !py-4 !rounded-2xl !bg-rose-500 !border-none !text-white !font-black !shadow-lg !shadow-rose-100"
            :loading="deleting"
            @click="deleteUsermain"
          />
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
import InputText from "primevue/inputtext";
import Toast from 'primevue/toast';

import UsersHeader from "@/components/Users/UsersHeader.vue";
import UsersTable from "@/components/Users/UsersTable.vue";
import UserEditDialog from "@/components/Users/UserEditDialog.vue";

const users = ref([]);
const loading = ref(false);
const search = ref("");
const scanInput = ref("");
const isScanning = ref(false);

const scanInputEl = ref(null); // ✅ InputText ref

const editDialog = ref(false);
const editUser = ref({});
const deleteDialog = ref(false);
const deleting = ref(false);
const selectedUser = ref(null);

const toast = useToast();

/* 🔹 GET ALL USERS */
const getUsers = async () => {
  try {
    loading.value = true;
    const { data } = await api.get("/users");
    users.value = data;
  } catch {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Foydalanuvchilar yuklanmadi",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

/* 🔹 REAL-TIME SEARCH */
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

    if (type === "userId") {
      params.userId = query;
    } else if (query.startsWith("+") || query.startsWith("998")) {
      params.phone = query;
    } else if (/^[A-Za-z\s]+$/.test(query)) {
      params.fullname = query;
    } else {
      params.autoNumber = query;
    }

    const { data } = await api.get("/users/find", { params });
    users.value = [data];

    // 🔊 Beep sound
    const audio = new Audio("/beep.mp3"); // public papkada beep.mp3 bo‘lishi kerak
    audio.play();
  } catch (err) {
    users.value = [];
    const audio = new Audio("/error.mp3"); // noto‘g‘ri scan uchun ovoz
    audio.play();
  toast.add({
  severity: "error",
  summary: "Xatolik",
  detail: `${err.response?.data?.message || err.message}`,
  life: 3000,
});

  } finally {
    loading.value = false;
  }
};

/* 🔹 AUTO SCAN (Enter’siz) */
watch(scanInput, async (val) => {
  if (!val || isScanning.value) return;

  isScanning.value = true;

  try {
    // 🔥 darhol inputni tozalaymiz (JSON ko‘rinmaydi)
    scanInput.value = "";

    const parsed = JSON.parse(val.trim());

    if (!parsed.userId) throw new Error("userId yo‘q");

    // 🔥 faqat userId ni yozamiz
    await nextTick();
    scanInput.value = parsed.userId;

    await findUser(parsed.userId, "userId");

  } catch (err) {
    // new Audio("/error.mp3").play();
  } finally {
    isScanning.value = false;
    await nextTick();
    scanInputEl.value?.focus();
  }
});



/* ✏️ EDIT */
const openEdit = (user) => {
  editUser.value = { ...user };
  editDialog.value = true;
};

/* 💾 UPDATE */
const updateUser = async (user) => {
  try {
    const payload = {
      fullname: user.fullname,
      phone: user.phone,
      autoNumber: user.autoNumber,
      language: user.language,
      cardNumber: user.cardNumber,
    };

    await api.put(`/users/${user._id}`, payload);

    toast.add({
      severity: "success",
      summary: "Saqlandi",
      detail: "Foydalanuvchi yangilandi",
      life: 3000,
    });

    editDialog.value = false;
    getUsers();
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail:
        err.response?.data?.message || "Saqlanmadi",
      life: 3000,
    });
  }
};


/* 🗑 DELETE */
const deleteUser = (user) => {
  selectedUser.value = user;
  deleteDialog.value = true;
};

const deleteUsermain = async () => {
  if (!selectedUser.value) return;
  deleting.value = true;

  try {
    await api.delete(`/users/${selectedUser.value._id}`);
    toast.add({
      severity: "success",
      summary: "O‘chirildi",
      detail: "Foydalanuvchi o‘chirildi",
      life: 3000,
    });
    deleteDialog.value = false;
    getUsers();
  } catch {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "O‘chirib bo‘lmadi",
      life: 3000,
    });
  } finally {
    deleting.value = false;
    selectedUser.value = null;
  }
};

/* 🔹 BALANCE REFRESH */
const onTransactionCompleted = () => {
  getUsers();
};

/* 🔹 AUTO FOCUS ON LOAD */
onMounted(async () => {
  await getUsers();
  await nextTick();
  scanInputEl.value?.focus();
});
</script>
<style scoped>
/* Skaner maydoni uchun ichki effekt */
:deep(.p-inputtext:focus) {
  box-shadow: none !important;
}

/* Dialog animatsiyalari va stili */
:deep(.p-dialog-mask) {
  backdrop-filter: blur(4px);
}

:deep(.p-dialog-content) {
  padding: 2rem !important;
}
</style>