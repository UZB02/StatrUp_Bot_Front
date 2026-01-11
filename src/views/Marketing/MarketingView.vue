<template>
  <div class="p-4">
    <div>
      <h2 class="text-xl font-bold mb-4">Marketing xabar yuborish</h2>

      <!-- Filial tanlash -->
      <div class="mb-4">
        <label class="font-semibold mb-2 block">Filial tanlang:</label>
        <Dropdown
          v-model="selectedFilial"
          :options="filials"
          option-label="name"
          option-value="_id"
          placeholder="Filialni tanlang"
          class="w-full"
        />
      </div>

      <!-- Xabar matni -->
      <div class="mb-4">
        <label class="font-semibold mb-2 block">Xabar matni:</label>
        <Textarea 
          v-model="adminMessage"
          rows="4"
          placeholder="Marketing matnini yozing"
          class="w-full"
        />
      </div>

      <!-- Preview tugmasi -->
      <div class="mb-4 flex gap-2">
        <Button
          label="Preview"
          icon="pi pi-eye"
          @click="previewMessage"
          :disabled="!selectedFilial"
        />
        <Button
          label="Yuborish"
          icon="pi pi-send"
          class="p-button-success"
          @click="sendMarketing"
          :disabled="!selectedFilial"
        />
      </div>

      <!-- Preview -->
      <div v-if="previewText" class="mt-4 p-4 border rounded bg-gray-50">
        <h3 class="font-semibold mb-2">Preview:</h3>
        <pre>{{ previewText }}</pre>
      </div>

      <!-- Statistikalar -->
      <div v-if="stats" class="mt-4 p-4 border rounded bg-green-50">
        <h3 class="font-semibold mb-2">Statistika:</h3>
        <p>Jami foydalanuvchilar: {{ stats.totalUsers }}</p>
        <p>Yuborilgan: {{ stats.successCount }}</p>
        <p>Yuborilmadi: {{ stats.failedCount }}</p>
      </div>
    </div>
  </div>
   <Toast />
</template>

<script setup>
import { ref, onMounted } from "vue";
import  Dropdown  from "primevue/dropdown";
import Textarea from 'primevue/textarea';
import  Button  from "primevue/button";
import  Card from "primevue/card";
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import api from "@/utils/api.js";

const filials = ref([]);
const selectedFilial = ref(null);
const adminMessage = ref("");
const previewText = ref("");
const stats = ref(null);
const toast = useToast();



const getFilials =async ()=>{
    try{
       const { data } = await api.get("/filials"); // barcha filiallar
    filials.value = data;
    console.log(filials.value);
    }catch (err){
        console.log(err);
    }
}
getFilials()

// Preview
const previewMessage = async () => {
  if (!selectedFilial.value) return;
  try {
    const { data } = await api.post("/marketing/preview", {
      filialId: selectedFilial.value,
      message: adminMessage.value,
    });
    previewText.value = data.preview;
  } catch (err) {
    console.error(err);
  }
};

// Yuborish
const sendMarketing = async () => {
  if (!selectedFilial.value) return;
  try {
    const { data } = await api.post("/marketing/send", {
      filialId: selectedFilial.value,
      message: adminMessage.value,
    });
    stats.value = data.stats;
    toast.add({
      severity: "success",
      summary: "Tayyor",
      detail: "Xabar yuborildi",
      life: 3000,
    });
  } catch (err) {
    console.error(err);
    alert("Marketing yuborishda xatolik yuz berdi");
  }
};
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
