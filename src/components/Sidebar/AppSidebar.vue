<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Button from "primevue/button";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const route = useRoute();
const { hasRole } = useAuth();

const props = defineProps({ collapsed: { type: Boolean, default: true } });
const emit = defineEmits(["toggle"]);

// Menu items with role-based access
const menuItems = ref([
  { label: "Dashboard", icon: "pi pi-home", to: "/", roles: ["superadmin"] },
  { label: "Adminlar", icon: "pi pi-users", to: "/admins", roles: ["superadmin"] },
  { label: "Filiallar", icon: "pi pi-sitemap", to: "/filials", roles: ["superadmin"] },
  { label: "Mahsulotlar", icon: "pi pi-database", to: "/products", roles: ["superadmin"] },
  { label: "Mijozlar", icon: "pi pi-address-book", to: "/users", roles: ["admin", "superadmin"] },
  { label: "Vakansiyalar", icon: "pi pi-sitemap", to: "/vacancies", roles: ["superadmin"] },
]);

// Reactive desktop flag
const isDesktop = ref(window.innerWidth >= 768);

const updateWidth = () => {
  isDesktop.value = window.innerWidth >= 768;
};

onMounted(() => {
  window.addEventListener("resize", updateWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});

// Navigate function
function navigate(path) {
  if (path) {
    router.push(path);
    if (!isDesktop.value) emit("toggle");
  }
}
</script>

<template>
  <aside
    :class="[
      'bg-white border-r border-gray-300 transition-transform duration-300 ease-in-out h-full z-50 flex flex-col fixed md:static top-0 left-0',
      collapsed ? '-translate-x-full md:translate-x-0 md:w-16' : 'translate-x-0 w-64'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between p-4 border-b border-gray-300">
      <span class="font-bold text-blue-600 text-lg" v-if="!collapsed">StartUp</span>
      <Button
        :icon="collapsed ? 'pi pi-arrow-right' : 'pi pi-arrow-left'"
        class="p-button-rounded p-button-text hidden md:inline-flex"
        @click="$emit('toggle')"
      />
    </div>

    <!-- Menu -->
    <ul class="flex-1 flex flex-col mt-4 space-y-2 px-2">
      <li v-for="(menuItem, index) in menuItems" :key="index">
        <Button
          v-if="menuItem.roles && hasRole(menuItem.roles)"
          :label="!collapsed ? menuItem.label : ''"
          :icon="menuItem.icon"
          :class="[
            'w-full justify-start',
            route.path === menuItem.to
              ? 'bg-blue-100 text-blue-600 font-semibold'
              : 'hover:bg-blue-50'
          ]"
          v-tooltip="collapsed ? menuItem.label : null"
          @click="navigate(menuItem.to)"
        />
      </li>
    </ul>
  </aside>
</template>
