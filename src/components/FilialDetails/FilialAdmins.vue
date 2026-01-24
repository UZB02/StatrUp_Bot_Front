<template>
  <div class="min-h-screen bg-[#f8fafc] pb-12">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
      
      <div class="relative mb-10 overflow-hidden bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
        
        <div class="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-5">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-100 ring-4 ring-blue-50">
              <i class="pi pi-users text-2xl"></i>
            </div>
            <div>
              <h1 class="text-3xl font-black text-slate-900 tracking-tight">Filial Adminlari</h1>
              <p class="text-slate-500 font-medium mt-1 italic flex items-center gap-2">
                <i class="pi pi-shield text-xs"></i>
                Boshqaruv huquqlarini taqsimlash
              </p>
            </div>
          </div>
          
          <div class="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 flex items-center gap-4 self-start">
            <div class="text-right">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jami tayinlangan</p>
              <p class="text-xl font-black text-emerald-600 leading-none">{{ admins.length }} nafar</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <i class="pi pi-user-check font-bold"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white p-8 md:p-10 transition-all overflow-hidden relative group">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-3">
              <span class="w-2 h-8 bg-emerald-500 rounded-full"></span>
              Tayinlangan Adminlar
            </h2>
          </div>
          
          <div v-if="admins.length === 0" class="text-center py-16 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <i class="pi pi-inbox text-3xl text-slate-300"></i>
            </div>
            <p class="text-slate-400 font-bold tracking-wide">Hozircha admin tayinlanmagan</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="admin in admins"
              :key="admin._id"
              class="group/item flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-50/50 transition-all duration-300"
            >
              <div class="flex items-center gap-5 flex-1">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-50 flex items-center justify-center text-slate-600 font-black text-sm border border-slate-200 group-hover/item:from-emerald-500 group-hover/item:to-teal-600 group-hover/item:text-white transition-all duration-500">
                  {{ getInitials(admin.fullname) }}
                </div>
                <div class="flex-1">
                  <p class="font-bold text-slate-800 text-lg leading-tight group-hover/item:text-emerald-700 transition-colors">{{ admin.fullname }}</p>
                  <div class="flex items-center gap-3 mt-1.5">
                    <span class="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                      <i class="pi pi-phone text-[10px]"></i>
                      {{ admin.phone }}
                    </span>
                    <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span class="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">Aktiv</span>
                  </div>
                </div>
              </div>
              <Button
                icon="pi pi-trash"
                @click="removeAdmin(admin._id)"
                class="!w-11 !h-11 !rounded-xl !bg-rose-50 !text-rose-500 !border-none opacity-0 group-hover/item:opacity-100 hover:!bg-rose-500 hover:!text-white transition-all duration-300"
                :loading="removing === admin._id"
                v-tooltip.top="'O\'chirish'"
              />
            </div>
          </div>
        </div>

        <div class="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-300 relative overflow-hidden group">
          <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
          
          <div class="relative">
            <h2 class="text-xl font-black text-white mb-2 flex items-center gap-3">
              <i class="pi pi-user-plus text-emerald-400"></i>
              Admin Qo'shish
            </h2>
            <p class="text-slate-400 text-sm font-medium mb-8">Filialni boshqarish uchun yangi mas'ul tayinlang</p>

            <div class="space-y-6">
              <div class="space-y-3">
                <label class="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                  Mavjud Adminlar
                </label>
                <Dropdown
                  v-model="selectedAdmin"
                  :options="filteredAdmins"
                  optionLabel="fullname"
                  optionValue="_id"
                  placeholder="Ro'yxatdan tanlang..."
                  class="w-full !rounded-2xl !bg-slate-800 !border-slate-700 !py-2 !text-white custom-dropdown"
                  :empty-message="filteredAdmins.length === 0 ? 'Hamma adminlar band' : ''"
                >
                  <template #option="slotProps">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                         {{ getInitials(slotProps.option.fullname) }}
                      </div>
                      <span class="font-bold text-slate-700">{{ slotProps.option.fullname }}</span>
                    </div>
                  </template>
                </Dropdown>
              </div>

              <Button
                label="Adminni Tayinlash"
                icon="pi pi-check-circle"
                class="w-full !py-4 !rounded-2xl !bg-emerald-500 hover:!bg-emerald-600 !border-none !text-lg !font-bold !shadow-xl !shadow-emerald-900/40 transition-all active:scale-95"
                :disabled="!selectedAdmin"
                @click="assignAdmin"
                :loading="assigning"
              />
            </div>

            <transition name="fade">
              <div v-if="filteredAdmins.length === 0 && admins.length > 0" class="mt-8 p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 backdrop-blur-sm">
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 flex-shrink-0">
                    <i class="pi pi-info-circle text-sm"></i>
                  </div>
                  <p class="text-xs font-bold text-emerald-100 leading-relaxed">
                    Barcha mavjud adminlar allaqachon ushbu filialga tayinlangan. Yangi admin qo'shish uchun "Adminlar" sahifasiga o'ting.
                  </p>
                </div>
              </div>
            </transition>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue"
import Button from "primevue/button"
import Dropdown from "primevue/dropdown"
import api from "@/utils/api"

const props = defineProps({
  admins: Array,
  allAdmins: Array,
  filialId: String
})

const emit = defineEmits(["refresh"])

const selectedAdmin = ref(null)
const assigning = ref(false)
const removing = ref(null)

const filteredAdmins = computed(() => {
  const assigned = props.admins.map(a => a._id)
  return props.allAdmins.filter(a => !assigned.includes(a._id))
})

const getInitials = (fullname) => {
  return fullname
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const assignAdmin = async () => {
  try {
    assigning.value = true
    await api.post("/filials/assign-admin", {
      adminId: selectedAdmin.value,
      filialId: props.filialId
    })
    selectedAdmin.value = null
    emit("refresh")
  } catch (error) {
    console.error("Admin tayinlash xatosi:", error)
  } finally {
    assigning.value = false
  }
}

const removeAdmin = async (adminId) => {
  if (!confirm("Admin filialdan chiqarilsinmi?")) return
  try {
    removing.value = adminId
    await api.put(`/filials/remove-admin/${adminId}`)
    emit("refresh")
  } catch (error) {
    console.error("Admin o'chirish xatosi:", error)
  } finally {
    removing.value = null
  }
}
</script>
<style scoped>
/* Custom styles for Dark Dropdown */
:deep(.custom-dropdown.p-dropdown) {
  border-width: 2px;
  transition: all 0.3s ease;
}

:deep(.custom-dropdown.p-dropdown:not(.p-disabled).p-focus) {
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

:deep(.custom-dropdown .p-dropdown-label) {
  color: white;
  font-weight: 600;
}

:deep(.custom-dropdown .p-dropdown-trigger) {
  color: #64748b;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
