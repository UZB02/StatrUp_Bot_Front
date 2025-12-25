<template>
  <div class="p-4">
    <!-- Header + Search -->
    <UsersHeader
      v-model:modelValue="search"
      @refresh="getUsers"
    />

    <!-- 🔹 QR / USB scanner input -->
    <div class="my-4">
      <InputText
        v-model="scanInput"
        placeholder="QR kodni skanerlang"
        class="w-full"
        :inputRef="scanInputEl"
      />
    </div>

    <!-- User table -->
    <UsersTable
      :users="users"
      :loading="loading"
      @edit="openEdit"
      @delete="deleteUser"
      @updated="onTransactionCompleted"
    />

    <!-- Edit dialog -->
    <UserEditDialog
      v-model:visible="editDialog"
      :user="editUser"
      @save="updateUser"
    />
  </div>

  <!-- Delete dialog -->
  <Dialog
    v-model:visible="deleteDialog"
    modal
    header="Foydalanuvchi o‘chirish"
    :style="{ width: '90vw', maxWidth: '400px' }"
  >
    <div class="space-y-3">
      <p>
        <strong>{{ selectedUser?.fullname }}</strong>
        foydalanuvchini o‘chirmoqchimisiz?
      </p>
      <p class="text-sm text-red-600">
        Bu amalni ortga qaytarib bo‘lmaydi.
      </p>
    </div>

    <template #footer>
      <Button label="Bekor qilish" text @click="deleteDialog = false" />
      <Button
        label="O‘chirish"
        icon="pi pi-trash"
        severity="danger"
        @click="deleteUsermain"
        :loading="deleting"
      />
    </template>
  </Dialog>

  <Toast />
</template>
<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import api from "@/utils/api.js";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";

import UsersHeader from "@/components/Users/UsersHeader.vue";
import UsersTable from "@/components/Users/UsersTable.vue";
import UserEditDialog from "@/components/Users/UserEditDialog.vue";

const users = ref([]);
const loading = ref(false);
const search = ref("");
const scanInput = ref("");
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
  }, 500);
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
  if (!val) return;
  try {
    const parsed = JSON.parse(val);
    if (!parsed.userId) throw new Error("userId topilmadi");
    await findUser(parsed.userId, "userId");
  } catch {
       const audio = new Audio("/error.mp3"); // noto‘g‘ri scan uchun ovoz
    audio.play();
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "QR kod noto‘g‘ri formatda",
      life: 3000,
    });
  } finally {
    scanInput.value = "";
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
    await api.put(`/users/${user._id}`, user);
    toast.add({
      severity: "success",
      summary: "Saqlandi",
      detail: "Foydalanuvchi yangilandi",
      life: 3000,
    });
    editDialog.value = false;
    getUsers();
  } catch {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Saqlanmadi",
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
