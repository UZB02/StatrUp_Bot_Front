<template>
  <div class="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md"
        >
          <i class="pi pi-chart-bar"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900">
          Oxirgi tranzaksiyalar
        </h3>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Loading -->
      <Skeleton
        v-if="loading"
        height="220px"
        borderRadius="8px"
      />

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="pb-3 text-left text-xs font-semibold uppercase text-gray-600">
                Xodim
              </th>
              <th class="pb-3 text-left text-xs font-semibold uppercase text-gray-600">
                Sana
              </th>
              <th class="pb-3 text-left text-xs font-semibold uppercase text-gray-600">
                Foydalanuvchi
              </th>
              <th class="pb-3 text-left text-xs font-semibold uppercase text-gray-600">
                Mahsulotlar
              </th>
              <th class="pb-3 text-left text-xs font-semibold uppercase text-gray-600">
                Filial
              </th>
              <th class="pb-3 text-left text-xs font-semibold uppercase text-gray-600">
                Turi
              </th>
              <th class="pb-3 text-right text-xs font-semibold uppercase text-gray-600">
                Summa
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="t in latest"
              :key="t._id"
              class="hover:bg-gray-50 transition"
            >
              <!-- Admin -->
              <td class="py-4 text-sm text-gray-600">
                <i class="pi pi-user mr-1"></i>
                {{ t.admin?.fullname || "-" }}
              </td>

              <!-- Date -->
              <td class="py-4 text-sm text-gray-600">
                {{ formatDate(t.createdAt) }}
              </td>

              <!-- User -->
              <td class="py-4 text-sm font-medium text-gray-900">
                <div class="flex items-center gap-2">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white"
                  >
                    {{ getInitials(t.user?.fullname || "Y") }}
                  </div>
                  {{ t.user?.fullname || "O'chirilgan" }}
                </div>
              </td>

              <!-- Products -->
              <td class="py-4 text-sm text-gray-600">
                <div class="space-y-1">
                  <div
                    v-for="item in t.items"
                    :key="item.product?._id"
                    class="text-xs"
                  >
                    {{ item.product?.name }} × {{ item.quantity }}
                  </div>
                </div>
              </td>

              <!-- Filial -->
              <td class="py-4 text-sm text-gray-600">
                {{ t.filial?.name || "-" }}
              </td>

              <!-- Type -->
              <td class="py-4">
                <span
                  v-if="t.type === 'earn'"
                  class="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700"
                >
                  Tushum
                </span>
                <span
                  v-else
                  class="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700"
                >
                  Xarajat
                </span>
              </td>

              <!-- Amount -->
              <td class="py-4 text-right font-semibold">
                <span
                  :class="t.type === 'earn'
                    ? 'text-green-600'
                    : 'text-red-600'"
                >
                  {{ t.type === 'earn' ? '+' : '-' }}
                  {{ format(t.amount ?? t.totalAmount ?? 0) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty -->
        <div
          v-if="!latest?.length"
          class="py-12 text-center text-gray-500"
        >
          Hozircha tranzaksiyalar yo‘q
        </div>

        <!-- Pagination -->
        <Paginator
          :rows="rows"
          :totalRecords="total"
          :rowsPerPageOptions="[5, 10, 20]"
          class="mt-6"
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
});

defineEmits(["page"]);

const getInitials = (fullname = "") => {
  const parts = fullname.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : fullname.slice(0, 2).toUpperCase();
};
</script>
