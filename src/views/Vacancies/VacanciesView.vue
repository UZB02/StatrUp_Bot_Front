<template>
  <div class="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Vakansiyalar</h1>
        <p class="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Ish o‘rinlarini boshqarish</p>
      </div>
      <Button 
        label="Yangi vakansiya" 
        icon="pi pi-plus" 
        @click="openCreate"
        class="!rounded-2xl !bg-slate-900 !border-none !px-6 !py-3 !shadow-xl !shadow-slate-200 hover:scale-105 transition-transform"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="vacancy in vacancies" 
        :key="vacancy.id" 
        class="group bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden"
      >
        <div class="absolute top-6 right-6">
          <Tag 
            :value="vacancy.status" 
            :severity="statusSeverity(vacancy.status)"
            class="!rounded-xl !px-3 !py-1 !text-[10px] !font-black !uppercase !tracking-wider shadow-sm"
          />
        </div>

        <div class="space-y-4">
          <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
            <i class="pi pi-briefcase text-xl"></i>
          </div>

          <div>
            <h3 class="text-xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
              {{ vacancy.title }}
            </h3>
            <p class="text-sm font-bold text-slate-400 mt-1 flex items-center gap-1">
              <i class="pi pi-building text-[10px]"></i> {{ vacancy.company }}
            </p>
          </div>

          <div class="pt-4 space-y-2 border-t border-slate-50">
            <div class="flex items-center gap-3 text-slate-600">
              <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <i class="pi pi-map-marker text-xs"></i>
              </div>
              <span class="text-xs font-semibold">{{ vacancy.location }}</span>
            </div>
            <div class="flex items-center gap-3 text-slate-600">
              <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i class="pi pi-money-bill text-xs"></i>
              </div>
              <span class="text-xs font-black text-slate-800">{{ vacancy.salary }}</span>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 flex justify-end gap-2 border-t border-dashed border-slate-100">
          <Button 
            icon="pi pi-pencil" 
            text 
            rounded 
            @click="openEdit(vacancy)"
            class="!text-amber-500 hover:!bg-amber-50 transition-colors"
          />
          <Button 
            icon="pi pi-trash" 
            text 
            rounded 
            severity="danger" 
            @click="confirmDelete(vacancy)"
            class="!text-rose-500 hover:!bg-rose-50 transition-colors"
          />
        </div>
      </div>
    </div>

    <Dialog 
      v-model:visible="dialogVisible" 
      modal 
      :header="form.id ? 'Vakansiyani tahrirlash' : 'Yangi vakansiya qo‘shish'" 
      :style="{ width: '100%', maxWidth: '500px' }"
      class="!rounded-[2.5rem] !border-none overflow-hidden"
    >
      <div class="flex flex-col gap-5 p-2">
        <div class="grid grid-cols-1 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-2">Lavozim nomi</label>
            <InputText v-model="form.title" placeholder="Masalan: Senior Developer" class="!rounded-2xl !bg-slate-50 !border-none !py-3 focus:!ring-2 focus:!ring-blue-500/20" />
          </div>
          
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-2">Kompaniya</label>
            <InputText v-model="form.company" placeholder="Kompaniya nomi" class="!rounded-2xl !bg-slate-50 !border-none !py-3" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2">Manzil</label>
              <InputText v-model="form.location" placeholder="Shahar" class="!rounded-2xl !bg-slate-50 !border-none !py-3" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2">Maosh</label>
              <InputText v-model="form.salary" placeholder="Masalan: $2000" class="!rounded-2xl !bg-slate-50 !border-none !py-3" />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-2">Holati</label>
            <Dropdown
              v-model="form.status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Tanlang"
              class="!rounded-2xl !bg-slate-50 !border-none !py-1"
            />
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex gap-3 w-full pb-4 pr-4">
          <Button label="Bekor qilish" text @click="dialogVisible = false" class="flex-1 !rounded-2xl !font-bold !text-slate-400" />
          <Button label="Saqlash" @click="save" class="flex-1 !rounded-2xl !bg-blue-600 !border-none !font-black shadow-lg shadow-blue-100" />
        </div>
      </template>
    </Dialog>

    <ConfirmDialog class="!rounded-[2rem] overflow-hidden" />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

// PrimeVue components
import Button from 'primevue/button'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'
import ConfirmDialog from 'primevue/confirmdialog'

const vacancies = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)

const form = ref({
  id: null,
  title: '',
  company: '',
  location: '',
  salary: '',
  status: 'active'
})

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

const confirm = useConfirm()
const toast = useToast()

onMounted(() => {
  loadVacancies()
})

const loadVacancies = async () => {
  vacancies.value = [
    { id: 1, title: 'Hisobchi', company: 'Sabr Oil', location: 'Namangan', salary: '$1000', status: 'active' },
    { id: 2, title: 'Oddiy ishchi', company: 'Sabr Oil', location: 'Namangan', salary: '$200', status: 'inactive' }
  ]
}

const openCreate = () => {
  isEdit.value = false
  form.value = { id: null, title: '', company: '', location: '', salary: '', status: 'active' }
  dialogVisible.value = true
}

const openEdit = (data) => {
  isEdit.value = true
  form.value = { ...data }
  dialogVisible.value = true
}

const save = async () => {
  if (isEdit.value) {
    const index = vacancies.value.findIndex(v => v.id === form.value.id)
    vacancies.value[index] = { ...form.value }
    toast.add({ severity: 'success', summary: 'Yangilandi', life: 3000 })
  } else {
    form.value.id = Date.now()
    vacancies.value.push({ ...form.value })
    toast.add({ severity: 'success', summary: 'Qo‘shildi', life: 3000 })
  }
  dialogVisible.value = false
}

const confirmDelete = (data) => {
  confirm.require({
    message: 'Vakansiyani o‘chirmoqchimisiz?',
    header: 'Tasdiqlash',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      vacancies.value = vacancies.value.filter(v => v.id !== data.id)
      toast.add({ severity: 'warn', summary: 'O‘chirildi', life: 3000 })
    }
  })
}

const statusSeverity = (status) => {
  return status === 'active' ? 'success' : 'secondary'
}
</script>
<style scoped>
:deep(.p-dialog-header) {
  padding: 2rem 2rem 1rem 2rem !important;
  background: white !important;
}

:deep(.p-dialog-header-title) {
  font-weight: 900 !important;
  color: #1e293b !important;
}

:deep(.p-card) {
  border: none !important;
}

:deep(.p-tag-value) {
  line-height: 1 !important;
}
</style>