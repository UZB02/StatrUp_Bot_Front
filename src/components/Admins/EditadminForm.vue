<template>
  <div class="min-h-screen bg-[#f8fafc] py-12 px-4">
    <div class="max-w-xl mx-auto">
      
      <Button 
        icon="pi pi-arrow-left" 
        label="Adminlar ro'yxatiga qaytish" 
        link 
        class="!text-slate-500 !mb-4 !p-0 hover:!text-emerald-600 transition-colors font-medium"
        @click="router.push('/admins')"
      />

      <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8 mb-6 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full blur-2xl"></div>
        
        <div class="relative flex items-center gap-5">
          <div class="w-14 h-14 bg-amber-500 shadow-lg shadow-amber-200 rounded-2xl flex items-center justify-center flex-shrink-0 text-white">
            <i class="pi pi-user-edit text-2xl"></i>
          </div>
          <div>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">Adminni tahrirlash</h2>
            <p class="text-slate-500 text-sm font-medium">Foydalanuvchi ma'lumotlarini yangilash</p>
          </div>
        </div>
      </div>

      <div v-if="loading && !fullname" class="bg-white rounded-[2.5rem] p-20 flex flex-col items-center shadow-sm border border-slate-100">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" fill="transparent" animationDuration=".5s" />
        <p class="mt-4 text-slate-400 font-medium tracking-wide">Ma'lumotlar o'qilmoqda...</p>
      </div>

      <div v-else class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-8 md:p-10 transition-all">
        <form @submit.prevent="update" class="space-y-6">
          
          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-700 ml-1">To'liq ism-sharif</label>
            <div class="relative group">
              <i class="pi pi-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors z-10"></i>
              <InputText 
                v-model="fullname" 
                placeholder="Masalan: Anvarov Akmal" 
                class="w-full !pl-12 !py-4 !rounded-2xl !border-slate-100 !bg-slate-50 focus:!bg-white focus:!ring-4 focus:!ring-emerald-50 transition-all"
                :class="{ 'p-invalid': errors.fullname }"
              />
            </div>
            <small v-if="errors.fullname" class="text-rose-500 font-bold ml-1">{{ errors.fullname }}</small>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 ml-1">Telefon raqam</label>
              <InputMask 
                v-model="phone" 
                mask="+998 99 999 99 99"
                placeholder="+998 __ ___ __ __" 
                class="w-full !py-4 !rounded-2xl !border-slate-100 !bg-slate-50"
                :class="{ 'p-invalid': errors.phone }"
              />
              <small v-if="errors.phone" class="text-rose-500 font-bold ml-1">{{ errors.phone }}</small>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 ml-1">Vazifasi (Rol)</label>
              <Dropdown 
                v-model="role" 
                :options="roles" 
                optionLabel="label" 
                optionValue="value"
                placeholder="Tanlang" 
                class="w-full !rounded-2xl !border-slate-100 !bg-slate-50 !py-1"
                :class="{ 'p-invalid': errors.role }"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-700 ml-1">
              Yangi parol <span class="text-[10px] text-slate-400 font-normal ml-2">(Ixtiyoriy)</span>
            </label>
            <Password 
              v-model="password" 
              placeholder="O'zgartirish uchun yozing..." 
              toggleMask
              :feedback="false"
              class="w-full"
              input-class="w-full !py-4 !rounded-2xl !border-slate-100 !bg-slate-50"
            />
            <p class="text-[10px] text-slate-400 italic ml-1">* Bo'sh qoldirilsa, eski parol o'zgarmaydi</p>
          </div>

          <div class="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-4 items-start">
            <i class="pi pi-exclamation-circle text-amber-500 mt-1"></i>
            <p class="text-[13px] text-amber-800 leading-tight">
              <b>Diqqat:</b> Ma'lumotlarni o'zgartirish tizimdagi adminning huquqlariga va kirish ma'lumotlariga ta'sir qiladi.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Button 
              label="O'zgarishlarni saqlash" 
              type="submit"
              :loading="loading"
              icon="pi pi-save"
              class="w-full sm:flex-[2] !bg-emerald-500 hover:!bg-emerald-600 !border-none !py-4 !rounded-2xl !shadow-xl !shadow-emerald-100 !text-lg !font-bold"
            />
            <Button 
              label="Bekor qilish" 
              text
              class="w-full sm:flex-1 !text-slate-500 !py-4 !rounded-2xl hover:!bg-slate-100 font-bold"
              @click="router.push('/admins')"
              :disabled="loading"
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
import InputMask from 'primevue/inputmask';
import ProgressSpinner from 'primevue/progressspinner';

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
<style scoped>
:deep(.p-password input) {
  width: 100%;
}
:deep(.p-dropdown-label) {
  padding-left: 1rem;
  font-weight: 600;
  color: #334155;
}
</style>