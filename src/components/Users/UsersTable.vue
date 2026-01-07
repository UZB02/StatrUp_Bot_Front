<template>
  <div class="w-full space-y-4">
    <DataTable
      :value="users"
      :loading="loading"
      paginator
      :rows="10"
      class="rounded-lg shadow-sm"
    >
      <Column header="Ism familiya">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <UserAvatar :name="data.fullname" />
            <span class="font-medium">{{ data.fullname }}</span>
          </div>
        </template>
      </Column>
      <Column header="Telefon">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span class="font-medium">{{ data.phone }}</span>
          </div>
        </template>
      </Column>
<!-- 
      <Column field="phone" header="Telefon" /> -->
      <Column header="Avto raqam">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span class="font-medium bg-gray-500/20 w-24 text-center rounded">{{ data.autoNumber }}</span>
          </div>
        </template>
      </Column>

      <Column header="Balans">
        <template #body="{ data }">
          <span :class="data.balance >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ formatCurrency(data.balance) }}
          </span>
        </template>
      </Column>

      <Column header="Amallar">
        <template #body="{ data }">
          <div class="flex gap-2 flex-wrap">
            <Button icon="pi pi-pencil" severity="warning" rounded size="small" @click="$emit('edit', data)" />
            <Button icon="pi pi-trash" severity="danger" rounded size="small" @click="$emit('delete', data)" />
            <Button label="Qo‘shish" icon="pi pi-plus" size="small" @click="openAdd(data)" />
            <Button label="Ayirish" icon="pi pi-minus" size="small" @click="openSpend(data)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <AddBalanceDialog
      v-model="addDialog"
      :user="selectedUser"
      @saved="$emit('updated')"
    />

    <SpendBalanceDialog
      v-model="spendDialog"
      :user="selectedUser"
      @saved="$emit('updated')"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { formatCurrency } from "@/utils/formatCurrency";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";

import UserAvatar from "./UserAvatar.vue";
import AddBalanceDialog from "./AddBalanceDialog.vue";
import SpendBalanceDialog from "./SpendBalanceDialog.vue";

defineProps({
  users: Array,
  loading: Boolean
});

defineEmits(["edit", "delete", "updated"]);

const selectedUser = ref(null);
const addDialog = ref(false);
const spendDialog = ref(false);

const openAdd = (user) => {
  selectedUser.value = user;
  addDialog.value = true;
};

const openSpend = (user) => {
  selectedUser.value = user;
  spendDialog.value = true;
};
</script>
