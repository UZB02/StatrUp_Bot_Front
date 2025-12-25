<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import AppLayout from "@/layouts/AppLayout.vue";
import AuthLayout from "@/layouts/AythLayout.vue";

const route = useRoute();

const layout = computed(() => {
  return route.meta.layout || AuthLayout;
});
</script>
