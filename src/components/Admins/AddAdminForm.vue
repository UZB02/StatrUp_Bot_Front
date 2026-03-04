<template>
  <div class="min-h-screen bg-[#f8fafc] p-3 md:p-6 lg:p-8 flex flex-col">
    <div class="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center animate-fade-in py-4">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-4 px-1">
        <button 
          @click="router.push('/admins')"
          class="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all text-sm font-bold bg-transparent border-none cursor-pointer p-0 group"
        >
          <div class="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-blue-50 transition-colors">
            <i class="pi pi-arrow-left text-xs"></i>
          </div>
          Orqaga qaytish
        </button>
        <div class="flex items-center gap-2.5 text-slate-400 bg-white/50 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-slate-100 shadow-sm self-end sm:self-auto">
          <i class="pi pi-shield text-[10px] md:text-xs text-blue-500"></i>
          <span class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em]">Admin Creation Security</span>
        </div>
      </div>

      <div class="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white overflow-hidden flex flex-col">
        <!-- Premium Header Section -->
        <div class="bg-slate-900 px-6 py-5 md:px-8 md:py-6 text-white relative overflow-hidden">
          <div class="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div class="relative flex items-center gap-4 md:gap-5">
            <div class="w-10 h-10 md:w-14 md:h-14 bg-emerald-500 shadow-xl shadow-emerald-500/40 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 animate-scale-in">
              <i class="pi pi-user-plus text-lg md:text-2xl"></i>
            </div>
            <div>
              <h2 class="text-lg md:text-2xl font-black tracking-tight leading-tight">Yangi Admin</h2>
              <p class="text-slate-400 text-[10px] md:text-sm font-medium mt-0.5 md:mt-1">Tizim uchun yangi boshqaruvchi tayinlang</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="create" class="p-5 md:p-8 lg:p-10 space-y-6 md:space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-6 md:gap-y-8">
            
            <!-- Left Column: Basic Info -->
            <div class="space-y-5 md:space-y-6">
              <div class="flex items-center gap-3">
                <div class="w-1.5 h-5 md:h-6 bg-emerald-500 rounded-full"></div>
                <h3 class="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Asosiy ma'lumotlar</h3>
              </div>
              
              <div class="space-y-1.5 md:space-y-2">
                <label class="text-[13px] md:text-sm font-bold text-slate-700 ml-1">To'liq ism-sharif</label>
                <div class="relative group">
                  <i class="pi pi-id-card absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors z-10"></i>
                  <InputText 
                    v-model="fullname" 
                    placeholder="Masalan: Anvarov Akmal" 
                    class="w-full !pl-11 md:!pl-12 !py-2.5 md:!py-3.5 !rounded-xl md:!rounded-2xl !border-slate-100 !bg-slate-50 focus:!bg-white focus:!ring-4 focus:!ring-emerald-50 transition-all !text-sm md:!text-[15px]"
                    :class="{ 'p-invalid': submitted && !fullname }"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5 md:space-y-2">
                  <label class="text-[13px] md:text-sm font-bold text-slate-700 ml-1">Telefon</label>
                  <InputText 
                    v-model="phone" 
                    placeholder="+998..." 
                    class="w-full !py-2.5 md:!py-3.5 !rounded-xl md:!rounded-2xl !border-slate-100 !bg-slate-50 !text-sm md:!text-[15px]"
                    :class="{ 'p-invalid': submitted && !phone }"
                  />
                </div>
                <div class="space-y-1.5 md:space-y-2">
                  <label class="text-[13px] md:text-sm font-bold text-slate-700 ml-1">Parol</label>
                  <Password 
                    v-model="password" 
                    placeholder="••••••" 
                    toggleMask
                    :feedback="false"
                    class="w-full"
                    input-class="w-full !py-2.5 md:!py-3.5 !rounded-xl md:!rounded-2xl !border-slate-100 !bg-slate-50 !text-sm md:!text-[15px]"
                    :class="{ 'p-invalid': submitted && !password }"
                  />
                </div>
              </div>

              <div class="space-y-1.5 md:space-y-2">
                <label class="text-[13px] md:text-sm font-bold text-slate-700 ml-1">Vazifasi (Rol)</label>
                <Dropdown 
                  v-model="role" 
                  :options="roles" 
                  optionLabel="label" 
                  placeholder="Admin darajasini tanlang" 
                  class="w-full !rounded-xl md:!rounded-2xl !border-slate-100 !bg-slate-50 !py-0.5 md:!py-1 focus:!ring-4 focus:!ring-emerald-50"
                  :class="{ 'p-invalid': submitted && !role }"
                />
              </div>

              <transition name="fade">
                <div v-if="role" class="bg-blue-50/50 border border-blue-100 rounded-xl md:rounded-2xl p-4 md:p-5 flex gap-3 md:gap-4 mt-2">
                  <div class="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <i class="pi pi-info-circle text-blue-600 text-sm md:text-base"></i>
                  </div>
                  <p class="text-[11px] md:text-[13px] text-slate-600 leading-normal md:leading-relaxed">
                    <span class="font-black text-blue-700 uppercase tracking-tighter">{{ role.label }}:</span>
                    {{ role.description }}
                  </p>
                </div>
              </transition>
            </div>

            <!-- Right Column: Permissions -->
            <div class="space-y-5 md:space-y-6">
              <div v-if="role?.value === 'admin'" class="space-y-5 md:space-y-6 animate-fade-in flex flex-col h-full">
                <div class="flex items-center justify-between px-1">
                  <div class="flex items-center gap-3">
                    <div class="w-1.5 h-5 md:h-6 bg-blue-500 rounded-full"></div>
                    <h3 class="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Ruxsatnomalar</h3>
                  </div>
                  <button type="button" class="text-[9px] md:text-[11px] font-black text-blue-500 uppercase cursor-pointer hover:text-blue-700 transition-colors border-none bg-transparent" @click="selectAllPermissions">
                    Hammasini tanlash
                  </button>
                </div>
                
                <div class="grid grid-cols-2 gap-2 md:gap-3 bg-slate-50/30 p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 flex-1">
                  <div v-for="p in availablePermissions" :key="p.value" 
                       class="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-white transition-all cursor-pointer group border border-transparent hover:border-slate-100 hover:shadow-md"
                       @click="togglePermission(p.value)">
                    <div class="w-5 h-5 md:w-6 md:h-6 rounded md:rounded-lg border-2 flex items-center justify-center transition-all"
                         :class="permissions.includes(p.value) ? 'bg-emerald-500 border-emerald-500 shadow-md md:shadow-lg shadow-emerald-100' : 'bg-white border-slate-200 group-hover:border-emerald-300'">
                      <i v-if="permissions.includes(p.value)" class="pi pi-check text-[8px] md:text-[10px] text-white"></i>
                    </div>
                    <span class="text-[12px] md:text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{{ p.label }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="h-full min-h-[200px] md:min-h-[300px] flex flex-col items-center justify-center text-center p-6 md:p-8 bg-slate-50/20 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <div class="w-14 h-14 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center mb-4 md:mb-5 shadow-xl shadow-slate-200/50">
                  <i class="pi pi-shield text-slate-200 text-2xl md:text-4xl"></i>
                </div>
                <h4 class="text-slate-400 font-black text-[9px] md:text-xs uppercase tracking-[0.2em] mb-2">Xavfsizlik tizimi</h4>
                <p class="text-[11px] md:text-sm font-medium text-slate-400 max-w-[180px] md:max-w-[220px] leading-relaxed">
                  Ruxsatnomalarni belgilash uchun avval adminga rol tanlang
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 md:gap-4 pt-6 md:pt-8 border-t border-slate-50">
            <button 
              type="button"
              class="w-full sm:w-auto px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl text-sm font-bold text-slate-400 hover:bg-slate-50 transition-all border-none bg-transparent cursor-pointer"
              @click="router.push('/admins')"
            >
              Bekor qilish
            </button>
            <Button 
              label="Adminni yaratish" 
              type="submit"
              :loading="loading"
              icon="pi pi-check-circle"
              class="w-full sm:w-auto !bg-emerald-500 hover:!bg-emerald-600 !border-none !px-8 md:!px-10 !py-3 md:!py-4 !rounded-xl md:!rounded-2xl !shadow-2xl !shadow-emerald-100 !text-sm !font-black !transition-all active:!scale-95"
            />
          </div>
        </form>
      </div>

      <div class="mt-6 md:mt-8 flex items-center justify-center gap-2 md:gap-3 text-slate-400">
        <div class="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        <span class="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.25em] text-center">Authorized Operations Only • 256-bit Encryption</span>
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
const permissions = ref([]);
const loading = ref(false);
const submitted = ref(false);

const availablePermissions = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Filiallar', value: 'filials' },
  { label: 'Mahsulotlar', value: 'products' },
  { label: 'Mijozlar', value: 'users' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Vakansiyalar', value: 'vacancies' },
];

const togglePermission = (val) => {
  if (permissions.value.includes(val)) {
    permissions.value = permissions.value.filter(p => p !== val);
  } else {
    permissions.value.push(val);
  }
};

const selectAllPermissions = () => {
  permissions.value = availablePermissions.map(p => p.value);
};

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
      role: role.value.value,
      permissions: role.value.value === 'admin' ? permissions.value : []
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
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }

:deep(.p-password input) {
  width: 100%;
}

:deep(.p-dropdown-label) {
  padding: 0 0.75rem;
  font-size: 13px;
  font-weight: 600;
  height: 2.75rem;
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  :deep(.p-dropdown-label) {
    padding: 0 1rem;
    font-size: 14px;
    height: 3.5rem;
  }
}

:deep(.p-inputtext) {
  font-family: inherit;
}

.animate-fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-scale-in {
  animation: scaleIn 0.5s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.min-h-screen {
  overflow-x: hidden;
}
</style>