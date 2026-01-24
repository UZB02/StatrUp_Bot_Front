<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Button from "primevue/button";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const route = useRoute();
const { hasRole,admin, logout } = useAuth();

const props = defineProps({ collapsed: { type: Boolean, default: true } });
const emit = defineEmits(["toggle"]);

const menuItems = ref([
  { label: "Dashboard", icon: "pi pi-home", to: "/", roles: ["superadmin"] },
  { label: "Adminlar", icon: "pi pi-users", to: "/admins", roles: ["superadmin"] },
  { label: "Filiallar", icon: "pi pi-sitemap", to: "/filials", roles: ["superadmin"] },
  { label: "Mahsulotlar", icon: "pi pi-database", to: "/products", roles: ["superadmin"] },
  { label: "Mijozlar", icon: "pi pi-address-book", to: "/users", roles: ["admin", "superadmin"] },
  { label: "Marketing", icon: "pi pi-wave-pulse", to: "/marketing", roles: ["superadmin"] },
  { label: "Vakansiyalar", icon: "pi pi-briefcase", to: "/vacancies", roles: ["superadmin"] },
]);

const isDesktop = ref(window.innerWidth >= 768);
const updateWidth = () => isDesktop.value = window.innerWidth >= 768;

onMounted(() => window.addEventListener("resize", updateWidth));
onUnmounted(() => window.removeEventListener("resize", updateWidth));

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
      'bg-slate-50 border-r border-gray-200 transition-all duration-300 ease-in-out h-screen z-50 flex flex-col fixed md:static top-0 left-0 shadow-xl md:shadow-none',
      collapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-64'
    ]"
  >
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white">
      <div v-if="!collapsed" class="flex items-center gap-2 overflow-hidden">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <span class="text-white font-bold">B</span>
        </div>
        <span class="font-bold text-gray-800 text-xl tracking-tight">Bonly.uz</span>
      </div>
      <div v-else class="w-full flex justify-center">
         <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold">S</span>
        </div>
      </div>
      
      <button 
        @click="$emit('toggle')"
        class="hidden md:flex absolute -right-3 top-20 bg-white border border-gray-200 rounded-full w-6 h-6 items-center justify-center hover:bg-blue-50 transition-colors shadow-sm"
      >
        <i :class="['pi text-[10px]', collapsed ? 'pi-chevron-right' : 'pi-chevron-left']"></i>
      </button>
    </div>

    <nav class="flex-1 overflow-y-auto py-4 no-scrollbar">
      <ul class="space-y-1 px-3">
        <li v-for="(item, index) in menuItems" :key="index">
          <div
            v-if="item.roles && hasRole(item.roles)"
            @click="navigate(item.to)"
            v-tooltip.right="collapsed ? item.label : null"
            :class="[
              'group flex items-center cursor-pointer p-3 rounded-xl transition-all duration-200 relative',
              route.path === item.to 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
            ]"
          >
            <div 
                v-if="route.path === item.to && !collapsed" 
                class="absolute left-0 w-1 h-6 bg-white rounded-r-full"
            ></div>

            <i :class="[item.icon, 'text-lg', collapsed ? 'mx-auto' : 'mr-3']"></i>
            
            <span v-if="!collapsed" class="font-medium whitespace-nowrap overflow-hidden transition-opacity duration-200">
              {{ item.label }}
            </span>
          </div>
        </li>
      </ul>
    </nav>

    <div class="p-4 border-t border-gray-200 bg-white">
        <div :class="['flex items-center', collapsed ? 'justify-center' : 'gap-3']">
            <div class="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-gray-500"><i class="pi pi-user"></i></div>
            <div v-if="!collapsed" class="overflow-hidden">
                <p class="text-xs font-semibold text-gray-800 truncate">{{admin?.fullname}}</p>
                <p class="text-[10px] text-gray-500 truncate">{{admin?.phone}}</p>
            </div>
        </div>
    </div>
  </aside>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>