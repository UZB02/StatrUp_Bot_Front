<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Yangi Admin qo'shish</h2>
            <p class="text-sm text-gray-500">Yangi admin foydalanuvchisini tizimga qo'shing</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form @submit.prevent="create" class="space-y-5">
          <!-- Full Name -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-900">
              To'liq ism <span class="text-green-500">*</span>
            </label>
            <InputText 
              v-model="fullname" 
              placeholder="Familiya Ism Sharif" 
              class="w-full"
              :class="{ 'border-red-500': submitted && !fullname }"
            />
            <p v-if="submitted && !fullname" class="text-xs text-red-500">
              Bu maydon majburiy
            </p>
          </div>

          <!-- Phone -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-900">
              Telefon raqam <span class="text-green-500">*</span>
            </label>
            <InputText 
              v-model="phone" 
              placeholder="+998 90 123 45 67" 
              class="w-full"
              :class="{ 'border-red-500': submitted && !phone }"
            />
            <p v-if="submitted && !phone" class="text-xs text-red-500">
              Bu maydon majburiy
            </p>
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-900">
              Parol <span class="text-green-500">*</span>
            </label>
            <Password 
              v-model="password" 
              placeholder="Kamida 6 ta belgi" 
              class="w-full"
              :class="{ 'border-red-500': submitted && !password }"
              toggleMask
              :feedback="false"
            />
            <p v-if="submitted && !password" class="text-xs text-red-500">
              Bu maydon majburiy
            </p>
            <p v-else class="text-xs text-gray-500">
              Parol kamida 6 ta belgidan iborat bo'lishi kerak
            </p>
          </div>

          <!-- Role -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-900">
              Rol <span class="text-green-500">*</span>
            </label>
            <Dropdown 
              v-model="role" 
              :options="roles" 
              optionLabel="label" 
              placeholder="Admin rolini tanlang" 
              class="w-full"
              :class="{ 'border-red-500': submitted && !role }"
            />
            <p v-if="submitted && !role" class="text-xs text-red-500">
              Bu maydon majburiy
            </p>
          </div>

          <!-- Role Description -->
          <div v-if="role" class="bg-green-50 border border-green-200 rounded-lg p-4">
            <p class="text-sm text-gray-700">
              <span class="font-semibold text-green-700">{{ role.label }}:</span>
              {{ role.description }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 pt-4 border-t border-gray-200">
            <Button 
              label="Saqlash" 
              type="submit"
              :loading="loading"
              class="flex-1 bg-green-500 hover:bg-green-600 border-green-500 text-white font-semibold py-3"
              icon="pi pi-check"
            />
            <Button 
              label="Bekor qilish" 
              type="button"
              @click="router.push('/admins')"
              class="flex-1 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 font-semibold py-3"
              icon="pi pi-times"
              outlined
            />
          </div>
        </form>
      </div>

      <!-- Info Card -->
      <div class="mt-6 bg-gray-100 border border-gray-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-sm text-gray-700">
            <p class="font-semibold mb-1">Eslatma:</p>
            <p>Yaratilgan admin darhol tizimga kira oladi. Parolni xavfsiz joyda saqlang.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
    <Toast />
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/utils/api";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const router = useRouter();

const fullname = ref("");
const phone = ref("");
const password = ref("");
const role = ref(null);
const loading = ref(false);
const submitted = ref(false);

const roles = [
  { 
    label: "Admin", 
    value: "admin",
    description: "Asosiy boshqaruv vakolatlari bilan administrator"
  },
  { 
    label: "Superadmin", 
    value: "superadmin",
    description: "To'liq tizim nazorati va barcha vakolatlar"
  },
];

const create = async () => {
  submitted.value = true;
  
  if (!fullname.value || !phone.value || !password.value || !role.value) {
    return;
  }

  loading.value = true;
  try {
    await api.post("/admin", { 
      fullname: fullname.value, 
      phone: phone.value, 
      password: password.value, 
      role: role.value.value 
    });
     toast.add({ severity: 'success', summary: 'Muvoffaqqiyatli', detail: 'Admin qo\'shildi', life: 3000 });
    router.push("/admins");
  } catch (err) {
    console.error(err);
    toast.add({ severity: 'error', summary: 'Xatolik', detail: `${err.response?.data?.message || 'Xatolik yuz berdi'}`, life: 3000 });
  } finally {
    loading.value = false;
  }
};
</script>
