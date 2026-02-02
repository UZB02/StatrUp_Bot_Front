<template>
  <div class="space-y-6">
    <!-- FILTER PANEL -->
    <div class="flex flex-col xl:flex-row gap-4 xl:items-end xl:justify-between">
      <FilterPanel
        :filters="filters"
        :periods="periods"
        :months="months"
        :filials="filials"
        :products="products"
        @reload="reloadAll"
        @exportExcel="exportExcel"
      />
    </div>

    <!-- SUMMARY -->
    <SummaryGrid :loading="loading" :summary="summary" />

    <!-- CHART -->
    <StatsChart :loading="loading" :chartData="chartData" />
    <!-- PRODUCT COMPARISON -->
    <ProductComparisonChart
      v-if="filters.filial"
      :loading="loading"
      :chartData="productChartData"
    />
    <ProductGrowth v-if="productGrowth.length" :data="productGrowth" />

    <!-- LATEST TABLE -->
 <LatestTable
  :loading="loading"
  :latest="latest"
  :format="format"
  :formatDate="formatDate"
  :total="total"
  :rows="limit"
  :page="page"
  @page="onPage"
/>

  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import FilterPanel from '@/components/Dashboard/FilterPanel.vue'
import SummaryGrid from '@/components/Dashboard/SummaryGrid.vue'
import StatsChart from '@/components/Dashboard/StatsChart.vue'
import ProductComparisonChart from '@/components/Dashboard/ProductComparisonChart.vue'
import ProductGrowth from '@/components/Dashboard/ProductGrowth.vue'
import LatestTable from '@/components/Dashboard/LatestTable.vue'

import { useDashboardFilters } from '@/composables/fordashboard/useDashboardFilters'
import { useDashboardParams } from '@/composables/fordashboard/useDashboardParams'
import { useDashboardSummary } from '@/composables/fordashboard/useDashboardSummary'
import { useDashboardStats } from '@/composables/fordashboard/useDashboardStats'
import { useDashboardLatest } from '@/composables/fordashboard/useDashboardLatest'
import { useDashboardProducts } from '@/composables/fordashboard/useDashboardProducts'
import { useDashboardExportExcel } from '@/composables/fordashboard/useDashboardExportExcel'

const loading = ref(true)
const page = ref(1)
const limit = ref(10)

const onPage = async (event) => {
  page.value = event.page + 1
  limit.value = event.rows
  await loadLatest() // <--- yangi sahifa uchun so‘rov yuborish
}


const { filters, periods, months, filials, products, loadFilials, loadProducts } =
  useDashboardFilters()

const params = useDashboardParams(filters, page, limit)

const { summary, loadSummary } = useDashboardSummary(params)
const { chartData, loadStats } = useDashboardStats(params, filters)
const { latest, total, loadLatest } = useDashboardLatest(params)
const { productChartData, productGrowth, loadProductComparison, loadProductGrowth } =
  useDashboardProducts(params, filters)

const format = (n) => new Intl.NumberFormat('uz-UZ').format(n) + ' so‘m'
const formatDate = (d) => new Date(d).toLocaleDateString('uz-UZ')

const { exportExcel } = useDashboardExportExcel(params, formatDate)

const reloadAll = async () => {
  loading.value = true
  await Promise.all([
    loadSummary(),
    loadStats(),
    loadLatest(),
    loadProductComparison(),
    loadProductGrowth(),
  ])
  loading.value = false
}

watch(
  filters,
  async () => {
    page.value = 1
    await loadProducts()
    await reloadAll()
  },
  { deep: true },
)

onMounted(async () => {
  await loadFilials()
  await loadProducts()
  await reloadAll()
})
</script>
