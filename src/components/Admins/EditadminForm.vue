<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <button @click="router.push('/admins')" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Orqaga qaytish
        </button>
        <h1 class="text-3xl font-bold text-gray-900">Adminni tahrirlash</h1>
        <p class="text-gray-600 mt-2">Admin ma'lumotlarini yangilang</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !fullname" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div class="flex flex-col items-center justify-center py-12">
          <div class="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>

      <!-- Form Card -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <form @submit.prevent="update" class="space-y-6">
          <!-- Full Name Field -->
          <div class="space-y-2">
            <label for="fullname" class="block text-sm font-semibold text-gray-900">
              To'liq ism <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <InputText 
                id="fullname"
                v-model="fullname" 
                placeholder="Familiya Ism Sharif" 
                class="w-full pl-10 !border-gray-300 focus:!border-green-500 focus:!ring-2 focus:!ring-green-100" 
                :class="{ '!border-red-500 focus:!border-red-500 focus:!ring-red-100': errors.fullname }"
              />
            </div>
            <p v-if="errors.fullname" class="text-sm text-red-600">{{ errors.fullname }}</p>
          </div>

          <!-- Phone Field -->
          <div class="space-y-2">
            <label for="phone" class="block text-sm font-semibold text-gray-900">
              Telefon raqam <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <InputText 
                id="phone"
                v-model="phone" 
                placeholder="+998 90 123 45 67" 
                class="w-full pl-10 !border-gray-300 focus:!border-green-500 focus:!ring-2 focus:!ring-green-100"
                :class="{ '!border-red-500 focus:!border-red-500 focus:!ring-red-100': errors.phone }"
              />
            </div>
            <p v-if="errors.phone" class="text-sm text-red-600">{{ errors.phone }}</p>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-semibold text-gray-900">
              Yangi parol
            </label>
            <div class="relative">
              <Password 
                id="password"
                v-model="password" 
                placeholder="Yangi parol (ixtiyoriy)" 
                toggleMask 
                :feedback="false"
                inputClass="w-full pl-10 !border-gray-300 focus:!border-green-500 focus:!ring-2 focus:!ring-green-100"
              />
            </div>
            <p class="text-xs text-gray-500">Bo'sh qoldiring, parolni o'zgartirmaslik uchun</p>
          </div>

          <!-- Role Field -->
          <div class="space-y-2">
            <label for="role" class="block text-sm font-semibold text-gray-900">
              Rol <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <Dropdown 
                id="role"
                v-model="role" 
                :options="roles" 
                optionLabel="label" 
                optionValue="value"
                placeholder="Rolni tanlang" 
                class="w-full !border-gray-300 focus:!border-green-500 focus:!ring-2 focus:!ring-green-100"
                inputClass="pl-10"
                :class="{ '!border-red-500 focus:!border-red-500 focus:!ring-red-100': errors.role }"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center pl-10">
                    <span>{{ roles.find(r => r.value === slotProps.value)?.label }}</span>
                  </div>
                  <span v-else class="pl-10">{{ slotProps.placeholder }}</span>
                </template>
                <template #option="slotProps">
                  <div class="flex flex-col">
                    <span class="font-semibold">{{ slotProps.option.label }}</span>
                    <span class="text-xs text-gray-500">{{ slotProps.option.description }}</span>
                  </div>
                </template>
              </Dropdown>
            </div>
            <p v-if="errors.role" class="text-sm text-red-600">{{ errors.role }}</p>
          </div>

          <!-- Info Alert -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-sm text-green-800">
              <p class="font-semibold mb-1">Yangilash haqida</p>
              <p>Admin ma'lumotlari yangilangandan so'ng, o'zgarishlar darhol saqlangan bo'ladi.</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit"
              label="Yangilash" 
              icon="pi pi-check"
              :loading="loading" 
              class="flex-1 !bg-green-600 hover:!bg-green-700 !border-green-600 !text-white !font-semibold !py-3 !px-6 !rounded-lg !shadow-sm hover:!shadow transition-all"
            />
            <Button 
              type="button"
              label="Bekor qilish" 
              icon="pi pi-times"
              outlined
              @click="router.push('/admins')"
              :disabled="loading"
              class="flex-1 !border-gray-300 !text-gray-700 hover:!bg-gray-50 !font-semibold !py-3 !px-6 !rounded-lg transition-all"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
    <Toast />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/utils/api";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";


import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const router = useRouter();
const route = useRoute();

const fullname = ref("");
const phone = ref("");
const password = ref("");
const role = ref(null);
const loading = ref(false);
const errors = ref({});

const roles = [
  { 
    label: "Admin", 
    value: "admin",
    description: "Oddiy admin huquqlari"
  },
  { 
    label: "Superadmin", 
    value: "superadmin",
    description: "To'liq tizim boshqaruvi"
  },
];

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!fullname.value.trim()) {
    errors.value.fullname = "To'liq ism majburiy";
    isValid = false;
  }

  if (!phone.value.trim()) {
    errors.value.phone = "Telefon raqam majburiy";
    isValid = false;
  }

  if (!role.value) {
    errors.value.role = "Rol tanlash majburiy";
    isValid = false;
  }

  return isValid;
};

const fetchAdmin = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/admin/${route.params.id}`);
    fullname.value = res.data.fullname;
    phone.value = res.data.phone;
    role.value = res.data.role;
  } catch (err) {
    console.error(err);
    alert("Admin ma'lumotlarini yuklashda xatolik yuz berdi");
  } finally {
    loading.value = false;
  }
};

const update = async () => {
  if (!validateForm()) return;

  loading.value = true;
  try {
    const payload = { 
      fullname: fullname.value, 
      phone: phone.value, 
      role: role.value 
    };
    
    if (password.value) {
      payload.password = password.value;
    }

    await api.put(`/admin/${route.params.id}`, payload);
    toast.add({ severity: 'success', summary: 'Muvoffaqqiyatli', detail: 'Admin taxrirlandi', life: 3000 });
    router.push("/admins");
  } catch (err) {
    console.error(err);
     toast.add({ severity: 'error', summary: 'Xatolik', detail: `${err.response?.data?.message || 'Xatolik yuz berdi'}`, life: 3000 });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAdmin();
});
</script>
