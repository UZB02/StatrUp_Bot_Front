<template>
  <div class="h-screen bg-[#f1f5f9] flex flex-col overflow-hidden font-sans">
    
    <!-- 🏢 POS HEADER COMPONENT -->
    <UsersViewHeader 
      :users-count="users.length" 
      :admin-name="admin?.fullname" 
      :loading="loading"
      @refresh="getUsers"
    />

    <!-- 🔵 MAIN POS WORKSPACE -->
    <div class="flex-1 flex flex-col lg:flex-row overflow-hidden p-2 lg:p-3 gap-2 lg:gap-3">
      
      <!-- 📁 LEFT SIDE: USER LIST & SEARCH -->
      <div class="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        <!-- 🔍 SCAN & SEARCH COMPONENT -->
        <UsersControlPanel
          v-model:search-value="search"
          :is-scanning="isScanning"
          :scan-display="scanInputDisplay"
          @scanner-click="setFocus"
        >
          <template #scanner-input>
            <input ref="scanInputEl" v-model="scanInput" class="absolute opacity-0 pointer-events-none w-0 h-0" autocomplete="off" />
          </template>
        </UsersControlPanel>

        <!-- 📑 USERS TABLE -->
        <div class="flex-1 overflow-hidden">
          <UsersTable
            :users="users"
            :loading="loading"
            @edit="openEdit"
            @delete="confirmDelete"
            @select="selectUser"
            @updated="onTransactionCompleted"
            class="h-full"
            :selected-id="selectedUser?._id"
          />
        </div>
      </div>

      <!-- 💳 RIGHT SIDE: TRANSACTION TERMINAL (DESKTOP) -->
      <div class="hidden lg:flex w-[320px] xl:w-[380px] flex-col gap-3 overflow-hidden">
        <UserTransactionTerminal
          v-if="selectedUser"
          :user="selectedUser"
          @close="selectedUser = null"
          @transaction="openTransaction"
          @edit="openEdit"
          @delete="confirmDelete"
        />

        <!-- EMPTY STATE (DESKTOP) -->
        <div v-else class="h-full bg-white/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8">
          <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100 text-slate-200">
            <i class="pi pi-user text-xl"></i>
          </div>
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
            Mijozni tanlang yoki skanerlang
          </p>
        </div>
      </div>
    </div>

    <!-- 💳 MOBILE TRANSACTION DRAWER -->
    <Dialog 
      v-model:visible="mobileTerminalVisible" 
      position="bottom" 
      :modal="true" 
      :dismissableMask="true" 
      class="w-full !max-w-none !m-0 !rounded-t-[2.5rem] !rounded-b-none lg:!hidden !border-none shadow-2xl"
      :pt="{
        header: { class: '!hidden' },
        content: { class: '!p-0' }
      }"
    >
      <div class="p-5 bg-white rounded-t-[2.5rem] pb-8">
        <div @click="mobileTerminalVisible = false" class="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 cursor-pointer"></div>
        <UserTransactionTerminal
          v-if="selectedUser"
          :user="selectedUser"
          @close="mobileTerminalVisible = false"
          @transaction="openTransaction"
          @edit="openEdit"
          @delete="confirmDelete"
        />
      </div>
    </Dialog>

    <!-- MODALS -->
    <UserEditDialog v-model:visible="editDialog" :user="editUser" @save="updateUserAndClose" />
    <AddBalanceDialog v-model="addDialog" :user="selectedUser" @saved="onTransactionCompleted" />
    <SpendBalanceDialog v-model="spendDialog" :user="selectedUser" @saved="onTransactionCompleted" />

    <Dialog v-model:visible="deleteDialog" modal header="Mijozni o'chirish" class="w-[90vw] max-w-[400px]">
      <div class="p-4 text-center">
        <p class="text-slate-600 font-bold mb-6">"{{ selectedUser?.fullname }}" tizimdan o'chirilsinmi?</p>
        <div class="flex gap-3">
          <button class="flex-1 py-3.5 bg-slate-50 rounded-xl border-none text-slate-400 font-black text-[11px] uppercase cursor-pointer" @click="deleteDialog = false">Yo'q</button>
          <button class="flex-1 py-3.5 bg-rose-500 rounded-xl border-none text-white font-black text-[11px] uppercase cursor-pointer shadow-lg shadow-rose-500/10" :disabled="deleting" @click="handleDelete">O'chirish</button>
        </div>
      </div>
    </Dialog>

    <Toast position="bottom-right" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Dialog from "primevue/dialog";
import Toast from 'primevue/toast';

// Components
import UsersTable from "@/components/Users/UsersTable.vue";
import UserEditDialog from "@/components/Users/UserEditDialog.vue";
import AddBalanceDialog from "@/components/Users/AddBalanceDialog.vue";
import SpendBalanceDialog from "@/components/Users/SpendBalanceDialog.vue";
import UsersViewHeader from "@/components/Users/UsersViewHeader.vue";
import UsersControlPanel from "@/components/Users/UsersControlPanel.vue";
import UserTransactionTerminal from "@/components/Users/UserTransactionTerminal.vue";

// Composables
import { useUsers } from "@/composables/useUsers";
import { useScanner } from "@/composables/useScanner";

const admin = ref(JSON.parse(sessionStorage.getItem('admin') || '{}'));

const { 
  users, loading, search, selectedUser, 
  getUsers, findUser, refreshUser, updateUser, deleteUserById 
} = useUsers();

const { 
  scanInput, scanInputDisplay, isScanning, scanInputEl, setFocus 
} = useScanner((userId) => findUser(userId, "userId"));

const editDialog = ref(false);
const editUser = ref({});
const deleteDialog = ref(false);
const deleting = ref(false);
const mobileTerminalVisible = ref(false);
const addDialog = ref(false);
const spendDialog = ref(false);

const selectUser = (user) => {
  selectedUser.value = user;
  if (window.innerWidth < 1024) {
    mobileTerminalVisible.value = true;
  }
};

const openTransaction = (type) => {
  if (type === 'add') addDialog.value = true;
  else spendDialog.value = true;
};

const openEdit = (user) => { 
  editUser.value = { ...user }; 
  editDialog.value = true; 
};

const updateUserAndClose = async (userData) => {
  const success = await updateUser(userData);
  if (success) editDialog.value = false;
};

const confirmDelete = (user) => { 
  selectedUser.value = user; 
  deleteDialog.value = true; 
};

const handleDelete = async () => {
  deleting.value = true;
  const success = await deleteUserById(selectedUser.value._id);
  if (success) {
    deleteDialog.value = false;
    mobileTerminalVisible.value = false;
  }
  deleting.value = false;
};

const onTransactionCompleted = () => {
  getUsers();
  if(selectedUser.value) {
    refreshUser(selectedUser.value._id);
  }
};

onMounted(async () => {
  await getUsers();
  setFocus();
});
</script>

<style scoped>
:deep(.p-dialog-mask) { backdrop-filter: blur(4px); }
</style>