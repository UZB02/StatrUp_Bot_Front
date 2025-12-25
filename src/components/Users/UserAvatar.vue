<template>
  <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
    {{ name.charAt(0).toUpperCase() }}
  </div>
</template>

<script setup>
defineProps({ name: String });
</script>
