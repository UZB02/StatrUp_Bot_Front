<template>
  <div class="w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden transition-all duration-300">
    
    <div class="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 text-white">
            <i class="pi pi-arrow-up-right text-xl"></i>
          </div>
          <div>
            <h3 class="text-xl font-black text-slate-800 tracking-tight">Tranzaksiyalar</h3>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Oxirgi harakatlar tarixi</p>
          </div>
        </div>
        <span class="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-tighter">
          Jami: {{ total }} ta
        </span>
      </div>
    </div>

    <div class="p-4 sm:p-8">
      
      <div v-if="loading" class="space-y-4">
        <Skeleton v-for="i in 5" :key="i" height="4rem" borderRadius="1.5rem" />
      </div>

      <div v-else class="overflow-x-auto custom-scrollbar">
        <table class="w-full border-separate border-spacing-y-3">
          <thead>
            <tr class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <th class="px-4 pb-2 text-left">Foydalanuvchi</th>
              <th class="px-4 pb-2 text-left">Ma'lumot</th>
              <th class="px-4 pb-2 text-left">Mahsulotlar</th>
              <th class="px-4 pb-2 text-left">Filial</th>
              <th class="px-4 pb-2 text-center">Holat</th>
              <th class="px-4 pb-2 text-right">Summa</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="t in latest"
              :key="t._id"
              class="group hover:scale-[1.01] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <td class="bg-slate-50/50 group-hover:bg-white rounded-l-[1.5rem] p-4 transition-colors border-y border-l border-transparent group-hover:border-slate-100">
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xs shadow-md">
                      {{ getInitials(t.user?.fullname || "Y") }}
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white shadow-sm"
                         :class="t.type === 'earn' ? 'bg-emerald-500' : 'bg-rose-500'">
                      <i :class="t.type === 'earn' ? 'pi pi-plus' : 'pi pi-minus'"></i>
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-black text-slate-700 leading-none mb-1">
                       {{ t.user?.fullname || "O'chirilgan" }}
                    </div>
                    <div class="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <i class="pi pi-user text-[8px]"></i> {{ t.admin?.fullname || "Tizim" }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="bg-slate-50/50 group-hover:bg-white p-4 transition-colors border-y border-transparent group-hover:border-slate-100">
                <div class="text-xs font-bold text-slate-600 mb-1">{{ formatDate(t.createdAt) }}</div>
                <div class="text-[9px] font-medium text-slate-300 tracking-wider">#{{ t._id.slice(-6).toUpperCase() }}</div>
              </td>

              <td class="bg-slate-50/50 group-hover:bg-white p-4 transition-colors border-y border-transparent group-hover:border-slate-100">
                <div class="flex flex-wrap gap-1 max-w-[200px]">
                  <span v-for="item in t.items" :key="item.product?._id" 
                        class="px-2 py-0.5 bg-white border border-slate-100 rounded-md text-[9px] font-black text-slate-500 whitespace-nowrap">
                    {{ item.product?.name }} <span class="text-blue-500">x{{ item.quantity }}</span>
                  </span>
                </div>
              </td>

              <td class="bg-slate-50/50 group-hover:bg-white p-4 transition-colors border-y border-transparent group-hover:border-slate-100">
                <div class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  <span class="text-xs font-black text-slate-600 tracking-tight">{{ t.filial?.name || "-" }}</span>
                </div>
              </td>

              <td class="bg-slate-50/50 group-hover:bg-white p-4 text-center transition-colors border-y border-transparent group-hover:border-slate-100">
                <span
                  class="inline-flex items-center px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm"
                  :class="t.type === 'earn' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'"
                >
                  {{ t.type === 'earn' ? 'Tushum' : 'Xarajat' }}
                </span>
              </td>

              <td class="bg-slate-50/50 group-hover:bg-white rounded-r-[1.5rem] p-4 text-right transition-colors border-y border-r border-transparent group-hover:border-slate-100">
                <div class="text-sm font-black tracking-tight"
                     :class="t.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'">
                  {{ t.type === 'earn' ? '+' : '-' }} {{ format(t.amount ?? t.totalAmount ?? 0) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="!latest?.length" class="py-20 flex flex-col items-center justify-center opacity-40">
           <i class="pi pi-inbox text-5xl mb-4"></i>
           <p class="text-xs font-black uppercase tracking-widest">Ma'lumotlar mavjud emas</p>
        </div>
      </div>

      <div class="mt-8 flex justify-center border-t border-slate-50 pt-6">
    <Paginator
  :rows="rows"
  :totalRecords="total"
  :first="(page - 1) * rows"
  :rowsPerPageOptions="[5, 10, 20, total]"
  class="!bg-transparent !border-none !p-0 custom-paginator"
  @page="$emit('page', $event)"
/>

      </div>
    </div>
  </div>
</template>
<script setup>
import Skeleton from "primevue/skeleton";
import Paginator from "primevue/paginator";

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  latest: {
    type: Array,
    default: () => [],
  },
  format: {
    type: Function,
    required: true,
  },
  formatDate: {
    type: Function,
    required: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  rows: {
    type: Number,
    default: 10,
  },
    page: {
    type: Number,
    default: 1,
  },
});

defineEmits(["page"]);

const getInitials = (fullname = "") => {
  const parts = fullname.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : fullname.slice(0, 2).toUpperCase();
};
</script>
<style scoped>
/* Jadval satrlari orasidagi bo'shliq uchun */
.border-separate {
  border-spacing: 0 0.75rem;
}

/* Scrollbar dizayni */
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

/* Paginatorni modernizatsiya qilish */
:deep(.custom-paginator) {
  .p-paginator-page, .p-paginator-next, .p-paginator-last, .p-paginator-first, .p-paginator-prev {
    border-radius: 12px !important;
    min-width: 2.5rem;
    height: 2.5rem;
    font-weight: 800;
    font-size: 0.75rem;
    margin: 0 2px;
    border: none !important;
    transition: all 0.2s;
  }
  .p-highlight {
    background: #2563eb !important;
    color: white !important;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }
  .p-dropdown {
    border-radius: 12px;
    border: none;
    background: #f8fafc;
  }
}
</style>