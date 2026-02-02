<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div class="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60 w-full max-w-md border border-slate-100">
      
      <div class="text-center mb-8">
        <div class="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <i class="pi pi-lock text-white text-xl"></i>
        </div>
        <h2 class="text-2xl font-extrabold text-slate-800">Xush kelibsiz!</h2>
        <p class="text-slate-500 text-sm mt-1">Tizimga kirish uchun ma'lumotlarni kiriting</p>
      </div>

      <form @submit.prevent="login" class="space-y-5">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-slate-700 ml-1">
            <i class="pi pi-phone text-slate-400" /> Telefon raqami
          </label>
          <div class="w-full">
            <InputText
              v-model="phone"
              placeholder="+998 90 123 45 67"
              class="w-full !rounded-xl !border-slate-200 focus:!ring-2 focus:!ring-blue-500/20"
              :class="{ 'p-invalid': error && !phone }"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-slate-700 ml-1">
           <i class="pi pi-shield text-slate-400" /> Parol
          </label>
          <div class="p-input-icon-left w-full">
            <InputText
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full !rounded-xl !border-slate-200 focus:!ring-2 focus:!ring-blue-500/20"
              :class="{ 'p-invalid': error && !password }"
              toggleMask
            />
          </div>
        </div>

        <transition name="fade">
          <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg flex items-center gap-3">
            <i class="pi pi-exclamation-circle text-red-500"></i>
            <span class="text-red-600 text-xs font-medium">{{ error }}</span>
          </div>
        </transition>

        <Button
          type="submit"
          :label="loading ? 'Tekshirilmoqda...' : 'Tizimga kirish'"
          :loading="loading"
          class="w-full !py-3 !rounded-xl !bg-blue-600 hover:!bg-blue-700 !border-none !transition-all !duration-300 shadow-lg shadow-blue-100"
        />
      </form>
      
      <p class="text-center mt-8 text-xs text-slate-400">
        © {{ new Date().getFullYear() }} Barcha huquqlar himoyalangan
      </p>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import api from "../../utils/api.js";

const phone = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const router = useRouter();

const login = async () => {
  error.value = "";
  if (!phone.value || !password.value) {
    error.value = "Telefon va parolni kiriting";
    return;
  }

  try {
    loading.value = true;

    const res = await api.post("/auth/login", {
      phone: phone.value,
      password: password.value
    });
    // Admin token saqlash
    sessionStorage.setItem("adminToken", res.data.token);
    sessionStorage.setItem("admin", JSON.stringify(res.data.admin));

    // Rol bo‘yicha yo‘naltirish
    const role = res.data?.admin?.role;
    if (role === "superadmin") {
      router.push("/");       // Superadmin uchun bosh sahifa
    } else if (role === "admin") {
      router.push("/users");  // Admin uchun users sahifasi
    } else {
      router.push("/404");       // Default yo‘naltirish
    }

  } catch (err) {
    error.value =
      err.response?.data?.message || "Kirishda xatolik yuz berdi";
  } finally {
    loading.value = false;
  }
};

</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>