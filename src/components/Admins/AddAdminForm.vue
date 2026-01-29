<template>
  <div class="min-h-screen bg-[#f8fafc] py-12 px-4">
    <div class="max-w-xl mx-auto">
      
      <Button 
        icon="pi pi-arrow-left" 
        label="Orqaga qaytish" 
        link 
        class="!text-slate-500 !mb-4 !p-0 hover:!text-blue-600 transition-colors"
        @click="router.push('/admins')"
      />

      <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8 mb-6 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full blur-2xl"></div>
        
        <div class="relative flex items-center gap-5">
          <div class="w-14 h-14 bg-emerald-500 shadow-lg shadow-emerald-200 rounded-2xl flex items-center justify-center flex-shrink-0">
            <i class="pi pi-user-plus text-2xl text-white"></i>
          </div>
          <div>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">Yangi Admin</h2>
            <p class="text-slate-500 text-sm font-medium">Tizim uchun yangi boshqaruvchi tayinlang</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-8 md:p-10">
        <form @submit.prevent="create" class="space-y-6">
          
          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-700 ml-1">To'liq ism-sharif</label>
            <div class="relative group">
              <i class="pi pi-id-card absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"></i>
              <InputText 
                v-model="fullname" 
                placeholder="Masalan: Anvarov Akmal" 
                class="w-full !pl-12 !py-4 !rounded-2xl !border-slate-100 !bg-slate-50 focus:!bg-white focus:!ring-4 focus:!ring-emerald-50 transition-all"
                :class="{ 'p-invalid': submitted && !fullname }"
              />
            </div>
            <small v-if="submitted && !fullname" class="text-rose-500 font-bold ml-1">Ismni kiritish majburiy!</small>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 ml-1">Telefon</label>
              <InputText 
                v-model="phone" 
                placeholder="+998 90 123 45 67" 
                class="w-full !py-4 !rounded-2xl !border-slate-100 !bg-slate-50"
                :class="{ 'p-invalid': submitted && !phone }"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 ml-1">Parol</label>
              <Password 
                v-model="password" 
                placeholder="••••••" 
                toggleMask
                :feedback="false"
                class="w-full"
                input-class="w-full !py-4 !rounded-2xl !border-slate-100 !bg-slate-50"
                :class="{ 'p-invalid': submitted && !password }"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-700 ml-1">Vazifasi (Rol)</label>
            <Dropdown 
              v-model="role" 
              :options="roles" 
              optionLabel="label" 
              placeholder="Admin darajasini tanlang" 
              class="w-full !rounded-2xl !border-slate-100 !bg-slate-50 !py-1 focus:!ring-4 focus:!ring-emerald-50"
              :class="{ 'p-invalid': submitted && !role }"
            />
          </div>

          <transition name="fade">
            <div v-if="role" class="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex gap-4">
              <i class="pi pi-info-circle text-emerald-600 mt-1"></i>
              <p class="text-sm text-slate-600 leading-relaxed">
                <span class="font-black text-emerald-700 uppercase tracking-tighter">{{ role.label }}:</span>
                {{ role.description }}
              </p>
            </div>
          </transition>

          <div class="flex flex-col sm:flex-row items-center gap-4 pt-6">
            <Button 
              label="Adminni yaratish" 
              type="submit"
              :loading="loading"
              icon="pi pi-check-circle"
              class="w-full sm:flex-[2] !bg-emerald-500 hover:!bg-emerald-600 !border-none !py-4 !rounded-2xl !shadow-xl !shadow-emerald-100 !text-lg !font-bold"
            />
            <Button 
              label="Bekor qilish" 
              outlined
              class="w-full sm:flex-1 !border-slate-200 !text-slate-500 !py-4 !rounded-2xl hover:!bg-slate-50"
              @click="router.push('/admins')"
            />
          </div>
        </form>
      </div>

      <div class="mt-8 flex items-center justify-center gap-2 text-slate-400">
        <i class="pi pi-shield text-xs"></i>
        <span class="text-[11px] font-medium uppercase tracking-widest text-center">Xavfsiz ulanish orqali ma'lumotlar himoyalangan</span>
      </div>
    </div>
    <Toast />
  </div>
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
<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

:deep(.p-password input) {
  width: 100%;
}
</style>