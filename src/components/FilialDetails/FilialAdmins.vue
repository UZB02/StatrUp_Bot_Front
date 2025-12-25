<template>
  <div class="">
    <div class=" mx-auto">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <span class="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <i class="pi pi-users text-lg"></i>
          </span>
          Adminlar
        </h1>
        <p class="text-slate-600">Filial uchun adminlarni boshqaring</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <!-- Assigned Admins Section -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <i class="pi pi-check-circle text-green-600"></i>
          Tayinlangan Adminlar
        </h2>
        
        <!-- Empty State -->
        <div v-if="admins.length === 0" class="text-center py-8">
          <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <i class="pi pi-inbox text-2xl text-slate-400"></i>
          </div>
          <p class="text-slate-500">Hozircha admin tayinlanmagan</p>
        </div>

        <!-- Admin List -->
        <div v-else class="space-y-3">
          <div
            v-for="admin in admins"
            :key="admin._id"
            class="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <div class="flex items-center gap-4 flex-1">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                {{ getInitials(admin.fullname) }}
              </div>
              <div class="flex-1">
                <p class="font-semibold text-slate-900">{{ admin.fullname }}</p>
                <p class="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                  <i class="pi pi-phone text-xs"></i>
                  {{ admin.phone }}
                </p>
              </div>
            </div>
            <Button
              icon="pi pi-trash"
              severity="secondary"
              text
              rounded
              @click="removeAdmin(admin._id)"
              class="hover:bg-red-100 hover:text-red-600"
              :loading="removing === admin._id"
            />
          </div>
        </div>
      </div>

      <!-- Add Admin Section -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <i class="pi pi-plus-circle text-blue-600"></i>
          Admin Qo'shish
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Admin tanlang
            </label>
            <Dropdown
              v-model="selectedAdmin"
              :options="filteredAdmins"
              optionLabel="fullname"
              optionValue="_id"
              placeholder="Ro'yxatdan admin tanlang..."
              class="w-full"
              :empty-message="filteredAdmins.length === 0 ? 'Qo\'shish uchun admin yo\'q' : ''"
            />
          </div>

          <Button
            label="Adminni Tayinlash"
            icon="pi pi-check"
            class="w-full"
            :disabled="!selectedAdmin"
            @click="assignAdmin"
            :loading="assigning"
            severity="success"
          />
        </div>

        <!-- Info message -->
        <div v-if="filteredAdmins.length === 0 && admins.length > 0" class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p class="text-sm text-blue-800 flex items-center gap-2">
            <i class="pi pi-info-circle"></i>
            Barcha adminlar allaqachon tayinlangan
          </p>
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

