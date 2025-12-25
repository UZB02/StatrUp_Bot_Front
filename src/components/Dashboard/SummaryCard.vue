<template>
  <Card>
    <template #title>{{ title }}</template>
    <template #content>
      <p class="text-2xl font-bold" :class="colorClass">
        {{ displayValue }}
      </p>
    </template>
  </Card>
</template>

<script setup>
import Card from "primevue/card";

const props = defineProps({
  title: String,
  value: Number,
  color: String,
  isCurrency: { type: Boolean, default: true }, // yangi flag
});

// faqat isCurrency=true bo'lsa pul formatlanadi
const displayValue = props.isCurrency
  ? new Intl.NumberFormat("uz-UZ").format(props.value) + " so‘m"
  : props.value + " ta";

const colorClass = {
  green: "text-green-600",
  red: "text-red-600",
  blue: "text-blue-600",
  gray: "text-gray-600",
}[props.color];
</script>
