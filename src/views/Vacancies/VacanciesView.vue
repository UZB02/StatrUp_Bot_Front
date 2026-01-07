<template>
  <div class="p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Vakansiyalar</h1>
      <Button label="Yangi vakansiya" icon="pi pi-plus" @click="openCreate" />
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card v-for="vacancy in vacancies" :key="vacancy.id" class="shadow-md">
        <template #title>
          <div class="flex justify-between items-center">
            <span>{{ vacancy.title }}</span>
            <Tag :value="vacancy.status" :severity="statusSeverity(vacancy.status)" />
          </div>
        </template>

        <template #content>
          <p><b>Kompaniya:</b> {{ vacancy.company }}</p>
          <p><b>Manzil:</b> {{ vacancy.location }}</p>
          <p><b>Maosh:</b> {{ vacancy.salary }}</p>
        </template>

        <template #footer>
          <div class="flex justify-end gap-2">
            <Button icon="pi pi-pencil" size="small" @click="openEdit(vacancy)" />
            <Button icon="pi pi-trash" size="small" severity="danger" @click="confirmDelete(vacancy)" />
          </div>
        </template>
      </Card>
    </div>

    <!-- Create / Edit Dialog -->
    <Dialog v-model:visible="dialogVisible" modal header="Vakansiya" :style="{ width: '450px' }">
      <div class="flex flex-col gap-3">
        <InputText v-model="form.title" placeholder="Lavozim" />
        <InputText v-model="form.company" placeholder="Kompaniya" />
        <InputText v-model="form.location" placeholder="Manzil" />
        <InputText v-model="form.salary" placeholder="Maosh" />
        <Dropdown
          v-model="form.status"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Holat"
        />
      </div>
      <template #footer>
        <Button label="Bekor qilish" text @click="dialogVisible = false" />
        <Button label="Saqlash" @click="save" />
      </template>
    </Dialog>

    <!-- Delete Confirm -->
    <ConfirmDialog />
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
</style>
