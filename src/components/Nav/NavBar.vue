<template>
  <header
    class="flex items-center justify-between
           bg-white border-b border-gray-200
           px-3 sm:px-4 md:px-6
           h-14 sm:h-16"
  >
    <!-- Chap qism -->
    <div class="flex items-center gap-3">
      <!-- Sidebar toggle (faqat mobil & tablet) -->
      <Button
        icon="pi pi-bars"
        class="md:hidden p-button-text"
        @click="$emit('toggleSidebar')"
      />

      <!-- Title -->
      <h1
        class="text-base sm:text-lg font-semibold text-gray-700
               hidden sm:block"
      >
        Dashboard
      </h1>
    </div>

    <!-- O'ng qism -->
    <div class="flex items-center gap-1 sm:gap-2">
      <!-- Notification -->
      <!-- <Button
        icon="pi pi-bell"
        class="p-button-rounded p-button-text"
      /> -->

      <!-- User -->
      <Button
        icon="pi pi-user"
        class="p-button-rounded p-button-text"
        @click="toggleMenu"
      />

      <Menu ref="menu" :model="menuItems" popup />
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import { useAuth } from "@/composables/useAuth";

const {admin, logout } = useAuth();

const menu = ref(null)


// Logout
const handleLogout = () => {
  logout()
}

// Menu items
const menuItems = [
  {
    label: 'Profil',
    items: [
      {
        label: `${admin.value.fullname}`,
        icon: 'pi pi-user',
        disabled: true,
      },
      {
        label: 'Chiqish',
        icon: 'pi pi-sign-out',
        class: 'text-red-500',
        command: handleLogout,
      },
    ],
  },
]

// Toggle menu
const toggleMenu = (event) => {
  menu.value.toggle(event)
}
</script>
