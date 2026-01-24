<template>
  <div class="p-4 md:p-8 max-w-[1000px] mx-auto space-y-8">
    
    <div class="flex items-center gap-5 mb-10">
      <div class="relative">
        <div class="absolute inset-0 bg-orange-500 rounded-2xl blur-lg opacity-20 animate-pulse"></div>
        <div class="relative w-14 h-14 bg-gradient-to-br from-orange-400 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg text-white">
          <i class="pi pi-megaphone text-2xl"></i>
        </div>
      </div>
      <div>
        <h2 class="text-3xl font-black text-slate-900 tracking-tight leading-none">Marketing</h2>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Xabarnomalar yuborish tizimi</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      
      <div class="lg:col-span-7 space-y-6">
        <div class="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden">
          
          <div class="space-y-3 mb-6 group text-left">
            <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within:text-orange-500 transition-colors">
              <i class="pi pi-map-marker text-[10px]"></i> Filialni tanlang
            </label>
            <Dropdown
              v-model="selectedFilial"
              :options="filials"
              option-label="name"
              option-value="_id"
              :loading="loadingFilials"
              placeholder="Qaysi filial mijozlariga?"
              class="w-full !rounded-2xl !bg-slate-50 !border-none !py-2 focus:!ring-4 focus:!ring-orange-500/10 transition-all font-bold"
            />
          </div>

          <div class="space-y-3 mb-8 group text-left">
            <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within:text-orange-500 transition-colors">
              <i class="pi pi-align-left text-[10px]"></i> Xabar matni
            </label>
            <Textarea 
              v-model="adminMessage"
              rows="6"
              placeholder="Mijozlar uchun jozibador matn yozing..."
              class="w-full !rounded-[1.5rem] !bg-slate-50 !border-none !p-5 focus:!ring-4 focus:!ring-orange-500/10 transition-all font-medium text-slate-700 shadow-inner"
            />
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3">
            <Button
              label="Preview"
              icon="pi pi-eye"
              @click="previewMessage"
              :loading="loadingPreview"
              :disabled="!selectedFilial || !adminMessage"
              class="w-full sm:flex-1 !py-4 !rounded-2xl !bg-white !border-2 !border-slate-100 !text-slate-600 hover:!border-orange-200 hover:!text-orange-500 !transition-all !font-black !uppercase !text-[10px] !tracking-widest"
            />
            <Button
              label="Yuborish"
              icon="pi pi-send"
              @click="sendMarketing"
              :loading="loadingSend"
              :disabled="!selectedFilial || !adminMessage"
              class="w-full sm:flex-[2] !py-4 !rounded-2xl !bg-orange-500 !border-none !text-white !font-black !uppercase !text-[10px] !tracking-widest !shadow-lg !shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all"
            />
          </div>
        </div>
      </div>

      <div class="lg:col-span-5 space-y-6">
        
        <div v-if="previewText" class="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative animate-fadein">
          <div class="absolute top-4 right-6 opacity-20 italic font-black text-xs uppercase tracking-tighter text-white">Telegram Preview</div>
          <h3 class="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-4">Xabar ko'rinishi:</h3>
          <div class="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <pre class="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-200">{{ previewText }}</pre>
          </div>
        </div>

        <div v-if="stats" class="bg-emerald-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-100 relative overflow-hidden group animate-slidetop">
          <i class="pi pi-chart-bar absolute -right-4 -bottom-4 text-8xl opacity-10 group-hover:scale-110 transition-transform"></i>
          
          <h3 class="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em] mb-6">Yuborish statistikasi</h3>
          
          <div class="space-y-4 relative z-10 text-left">
            <div class="flex justify-between items-center border-b border-white/10 pb-2">
              <span class="text-sm font-medium opacity-80">Jami auditoriya:</span>
              <span class="text-xl font-black">{{ stats.totalUsers }}</span>
            </div>
            <div class="flex justify-between items-center border-b border-white/10 pb-2">
              <span class="text-sm font-medium opacity-80">Muvaffaqiyatli:</span>
              <span class="text-xl font-black text-emerald-100">{{ stats.successCount }}</span>
            </div>
            <div class="flex justify-between items-center text-rose-100">
              <span class="text-sm font-medium opacity-80">Yuborilmadi:</span>
              <span class="text-xl font-black">{{ stats.failedCount }}</span>
            </div>
          </div>
        </div>

        <div v-if="!previewText && !stats" class="h-full min-h-[200px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
          <i class="pi pi-chart-line text-slate-200 text-4xl mb-3"></i>
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Preview yoki Natijalar shu yerda ko'rinadi</p>
        </div>

      </div>
    </div>
  </div>

  <Toast position="bottom-right" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import Dropdown from "primevue/dropdown";
import Textarea from 'primevue/textarea';
import Button from "primevue/button";
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import api from "@/utils/api.js";

// State
const filials = ref([]);
const selectedFilial = ref(null);
const adminMessage = ref("");
const previewText = ref("");
const stats = ref(null);

const loadingFilials = ref(false);
const loadingPreview = ref(false);
const loadingSend = ref(false);

const toast = useToast();

/** 🔹 GET FILIALS */
const getFilials = async () => {
  try {
    loadingFilials.value = true;
    const { data } = await api.get("/filials");
    filials.value = data;
  } catch (err) {
    console.error("Filials load error:", err);
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Filiallar ro'yxatini yuklab bo'lmadi",
      life: 3000,
    });
  } finally {
    loadingFilials.value = false;
  }
};

/** 🔹 PREVIEW MESSAGE */
const previewMessage = async () => {
  if (!selectedFilial.value || !adminMessage.value) return;
  
  try {
    loadingPreview.value = true;
    const { data } = await api.post("/marketing/preview", {
      filialId: selectedFilial.value,
      message: adminMessage.value,
    });
    previewText.value = data.preview;
  } catch (err) {
    toast.add({
      severity: "warn",
      summary: "Preview xatoligi",
      detail: "Xabarni shakllantirishda xatolik yuz berdi",
      life: 3000,
    });
  } finally {
    loadingPreview.value = false;
  }
};

/** 🔹 SEND MARKETING */
const sendMarketing = async () => {
  if (!selectedFilial.value || !adminMessage.value) return;

  try {
    loadingSend.value = true;
    const { data } = await api.post("/marketing/send", {
      filialId: selectedFilial.value,
      message: adminMessage.value,
    });
    
    stats.value = data.stats;
    toast.add({
      severity: "success",
      summary: "Muvaffaqiyatli",
      detail: "Marketing xabarlari navbatga qo'yildi",
      life: 5000,
    });
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Yuborishda xatolik",
      detail: err.response?.data?.message || "Server bilan aloqa uzildi",
      life: 4000,
    });
  } finally {
    loadingSend.value = false;
  }
};

onMounted(() => {
  getFilials();
});
</script>

<style scoped>
.shadow-inner {
  box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
}

:deep(.p-dropdown-panel) {
  border-radius: 1.5rem !important;
  border: none !important;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1) !important;
  padding: 0.5rem;
}

/* Animations */
.animate-fadein {
  animation: fadeIn 0.5s ease-out;
}
.animate-slidetop {
  animation: slideTop 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideTop {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

pre {
  font-family: inherit;
  margin: 0;
}
</style>