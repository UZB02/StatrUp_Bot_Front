<template>
  <Dialog 
    :visible="visible" 
    @update:visible="onClose" 
    modal 
    :closable="false"
    class="w-[95vw] max-w-[450px] !rounded-[2.5rem] !overflow-hidden !border-none shadow-2xl"
  >
    <template #header>
      <div class="flex items-center gap-4 py-2">
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
          <i class="pi pi-user-edit text-xl"></i>
        </div>
        <div>
          <h3 class="text-xl font-black text-slate-900 leading-none">Profil tahriri</h3>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ma'lumotlarni yangilash</p>
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-5 pt-2">
      <div class="space-y-2 group">
        <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-indigo-500 transition-colors">
          <i class="pi pi-id-card text-[10px]"></i> Ism familiya
        </label>
        <InputText 
          v-model="localUser.fullname" 
          placeholder="Masalan: Ali Valiyev" 
          class="w-full !rounded-2xl !bg-slate-50 !border-none !py-4 !px-5 focus:!ring-2 focus:!ring-indigo-500/20 transition-all font-bold text-slate-700"
        />
      </div>

      <div class="space-y-2 group">
        <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-indigo-500 transition-colors">
          <i class="pi pi-phone text-[10px]"></i> Telefon raqami
        </label>
        <InputText 
          v-model="localUser.phone" 
          placeholder="+998 90 123 45 67" 
          class="w-full !rounded-2xl !bg-slate-50 !border-none !py-4 !px-5 focus:!ring-2 focus:!ring-indigo-500/20 transition-all font-bold text-slate-700"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2 group">
          <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-indigo-500 transition-colors">
            <i class="pi pi-car text-[10px]"></i> Avto raqam
          </label>
          <InputText 
            v-model="localUser.autoNumber" 
            placeholder="01 A 777 AA" 
            class="w-full !rounded-2xl !bg-slate-50 !border-none !py-4 !px-5 focus:!ring-2 focus:!ring-indigo-500/20 transition-all font-black text-slate-700 placeholder:font-normal uppercase"
          />
        </div>

        <div class="space-y-2 group">
          <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-indigo-500 transition-colors">
            <i class="pi pi-language text-[10px]"></i> Til
          </label>
          <Dropdown
            v-model="localUser.language"
            :options="['uz', 'ru', 'en']"
            placeholder="Tanlang"
            class="w-full !rounded-2xl !bg-slate-50 !border-none !py-1.5 focus:!ring-2 focus:!ring-indigo-500/20 transition-all font-bold"
          />
        </div>
      </div>

      <div class="flex items-center gap-3 pt-6">
        <Button 
          label="Bekor qilish" 
          text
          class="flex-1 !py-4 !rounded-2xl !font-bold !text-slate-400 hover:!bg-slate-50" 
          @click="onClose()" 
        />
        <Button 
          label="Saqlash" 
          icon="pi pi-check"
          class="flex-[2] !py-4 !rounded-2xl !bg-indigo-600 !border-none !text-white !font-black !shadow-lg !shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all"
          @click="save()" 
        />
      </div>
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
<style scoped>
:deep(.p-dialog-header) {
  padding: 2rem 2rem 1rem;
}
:deep(.p-dialog-content) {
  padding: 0 2rem 2.5rem;
}
</style>