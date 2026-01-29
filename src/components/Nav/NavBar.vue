<template>
  <header
    class="sticky top-0 z-40 flex items-center justify-between
           bg-white/80 backdrop-blur-md border-b border-gray-100
           px-4 md:px-8 h-16 transition-all duration-300"
  >
    <div class="flex items-center gap-4">
      <Button
        icon="pi pi-bars"
        class="md:hidden !p-2 !text-gray-500 !bg-gray-100/50 hover:!bg-gray-200/50 border-none"
        @click="$emit('toggleSidebar')"
      />

      <div class="flex flex-col leading-tight hidden sm:flex">
        <span class="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Sahifa</span>
        <h1 class="text-lg font-bold text-gray-800 tracking-tight">
          {{ currentRouteName }}
        </h1>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <div class="h-6 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>
      <div 
        class="flex items-center gap-2 pl-2 cursor-pointer group rounded-full p-1 hover:bg-gray-50 transition-all"
        @click="toggleMenu"
      >
        <div class="flex flex-col items-end  md:flex">
          <span class="text-sm font-semibold text-gray-700 leading-none group-hover:text-blue-600">
            {{ admin?.fullname || 'Admin' }}
          </span>
          <span class="text-[10px] text-gray-400">{{admin?.role || 'admin'}}</span>
        </div>
        <i class="pi pi-chevron-down text-[10px] text-gray-400 group-hover:text-gray-600 transition-transform hidden sm:block"></i>
      </div>

      <Menu ref="menu" :model="menuItems" popup class="!rounded-xl !shadow-2xl !border-gray-100 !p-2" />
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import { useRoute } from 'vue-router'
import { useAuth } from "@/composables/useAuth"

const { admin, logout } = useAuth()
const route = useRoute()
const menu = ref(null)

// Hozirgi sahifa nomini dinamik olish
const currentRouteName = computed(() => {
  return route.name || 'Dashboard'
})

const handleLogout = () => logout()

const menuItems = [
  {
    label: 'Mening profilim',
    items: [
      { 
        label: 'Chiqish', 
        icon: 'pi pi-sign-out', 
        class: 'logout-item',
        command: handleLogout 
      }
    ]
  }
]

const toggleMenu = (event) => menu.value.toggle(event)
</script>

<style>
/* PrimeVue Menu-ni biroz chiroyli qilish */
.p-menu.p-menu-overlay {
    border-radius: 12px !important;
    padding: 8px !important;
}
.logout-item .p-menuitem-link {
    color: #ef4444 !important;
}
.logout-item .p-menuitem-icon {
    color: #ef4444 !important;
}
</style>