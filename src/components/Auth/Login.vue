<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h2 class="text-2xl font-bold text-center mb-4">Tizimga kirish</h2>

      <!-- Telefon -->
      <div class="mb-4">
        <label class="block mb-1 text-sm font-medium text-gray-700">
          Telefon raqami
        </label>
        <InputText
          v-model="phone"
          placeholder="+998901234567"
          class="w-full"
        />
      </div>

      <!-- Parol -->
      <div class="mb-4">
        <label class="block mb-1 text-sm font-medium text-gray-700">
          Parol
        </label>
        <InputText
          v-model="password"
          type="password"
          placeholder="********"
          class="w-full"
        />
      </div>

      <Button
        :label="loading ? 'Yuklanmoqda...' : 'Kirish'"
        class="w-full"
        :loading="loading"
        @click="login"
      />

      <p v-if="error" class="mt-3 text-red-500 text-sm">{{ error }}</p>
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
  console.log(phone.value, password.value);

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

    console.log(res);
    // Admin token saqlash
    sessionStorage.setItem("adminToken", res.data.token);
    sessionStorage.setItem("admin", JSON.stringify(res.data.admin));

    // Rol bo‘yicha yo‘naltirish
    const role = res.data.admin.role;
    if (role === "supperadmin") {
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
