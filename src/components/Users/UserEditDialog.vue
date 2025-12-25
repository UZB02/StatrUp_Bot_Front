<template>
  <Dialog
    :visible="visible"
    @update:visible="onClose"
    header="Foydalanuvchini tahrirlash"
    modal
    style="width: 400px"
  >
    <div class="flex flex-col gap-3">
      <InputText v-model="localUser.fullname" placeholder="Ism familiya" />
      <InputText v-model="localUser.phone" placeholder="Telefon" />
      <InputText v-model="localUser.autoNumber" placeholder="Avto raqam" />
      <InputText v-model="localUser.language" placeholder="Til" />

      <Button
        label="Saqlash"
        icon="pi pi-check"
        @click="save"
      />
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  visible: Boolean,
  user: Object,
});

const emit = defineEmits(["update:visible", "save"]);

const localUser = ref({});

// prop → local copy
watch(
  () => props.user,
  (val) => {
    localUser.value = { ...val };
  },
  { immediate: true }
);

const onClose = (val) => {
  emit("update:visible", val);
};

const save = () => {
  emit("save", localUser.value);
};
</script>
