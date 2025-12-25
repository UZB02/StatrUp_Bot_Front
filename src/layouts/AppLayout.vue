<template>
  <div class="flex h-screen w-full overflow-hidden bg-gray-100">
    <!-- Overlay (mobil va tablet) -->
    <transition name="fade">
      <div
        v-if="!sidebarCollapsed && isMobile"
        class="fixed inset-0 bg-black/50 z-40"
        @click="closeSidebar"
      />
    </transition>

    <!-- Sidebar -->
    <Sidebar
      :collapsed="sidebarCollapsed"
      :isMobile="isMobile"
      class="z-50"
      @toggle="toggleSidebar"
    />

    <!-- Main Content -->
    <div class="flex flex-col flex-1 min-w-0">
      <Navbar @toggleSidebar="toggleSidebar" />

      <main
        class="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6"
      >
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Sidebar from "../components/Sidebar/AppSidebar.vue";
import Navbar from "../components/Nav/NavBar.vue";

/* State */
const sidebarCollapsed = ref(true);
const isMobile = ref(false);

/* Methods */
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const closeSidebar = () => {
  sidebarCollapsed.value = true;
};

/* Screen size detect */
const handleResize = () => {
  isMobile.value = window.innerWidth < 1024; // lg breakpoint
  if (!isMobile.value) {
    sidebarCollapsed.value = false; // desktopda ochiq
  } else {
    sidebarCollapsed.value = true; // mobil/tabletda yopiq
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
/* Overlay animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
