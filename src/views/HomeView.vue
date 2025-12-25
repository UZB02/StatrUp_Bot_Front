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

    <!-- LATEST TABLE -->
    <LatestTable
      :loading="loading"
      :latest="latest"
      :format="format"
      :formatDate="formatDate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import api from "@/utils/api.js";

/* Components */
import FilterPanel from "@/components/Dashboard/FilterPanel.vue";
import SummaryGrid from "@/components/Dashboard/SummaryGrid.vue";
import StatsChart from "@/components/Dashboard/StatsChart.vue";
import LatestTable from "@/components/Dashboard/LatestTable.vue";

/* STATE */
const loading = ref(true);
const filters = ref({
  period: "year",
  year: new Date().getFullYear(),
  month: null,
  from: null,
  to: null,
  filial: null,
  product: null,
});
const periods = [
  { label: "Yillik", value: "year" },
  { label: "Oylik", value: "month" },
  { label: "Haftalik", value: "week" },
  { label: "Kunlik", value: "day" },
];
const months = [
  { label: "Yanvar", value: 1 },
  { label: "Fevral", value: 2 },
  { label: "Mart", value: 3 },
  { label: "Aprel", value: 4 },
  { label: "May", value: 5 },
  { label: "Iyun", value: 6 },
  { label: "Iyul", value: 7 },
  { label: "Avgust", value: 8 },
  { label: "Sentyabr", value: 9 },
  { label: "Oktyabr", value: 10 },
  { label: "Noyabr", value: 11 },
  { label: "Dekabr", value: 12 },
];

/* FILIAL & PRODUCT LISTS */
const filials = ref([]);
const products = ref([]);

/* DATA */
const summary = ref({ earn: 0, spend: 0, balance: 0, earnCount: 0, spendCount: 0 });
const latest = ref([]);
const chartData = ref({
  labels: [],
  datasets: [
    { label: "Tushum", backgroundColor: "#22c55e", data: [] },
    { label: "Xarajat", backgroundColor: "#ef4444", data: [] },
  ],
});

/* HELPERS */
const format = (n) => new Intl.NumberFormat("uz-UZ").format(n) + " so‘m";
const formatDate = (d) => new Date(d).toLocaleDateString("uz-UZ");

/* BUILD PARAMS */
const params = () => {
  const p = {
    period: filters.value.period,
    year: filters.value.year,
    month: filters.value.month,
    from: filters.value.from ? filters.value.from.toISOString() : null,
    to: filters.value.to ? filters.value.to.toISOString() : null,
    filial: filters.value.filial,
    product: filters.value.product,
  };
  return p;
};

/* API LOAD FUNCTIONS */
const loadFilials = async () => {
  try {
    const { data } = await api.get("/filials");
    filials.value = data;
  } catch (err) {
    console.error("Filials load error:", err);
  }
};

/* loadProducts funksiyasini filial filtrini qo'llab ishlash uchun yangilaymiz */
const loadProducts = async () => {
  try {
    let url = "/products";
    if (filters.value.filial) {
      url = `/products/by-filial?filial=${filters.value.filial}`;
    }
    const { data } = await api.get(url);
    products.value = data;
  } catch (err) {
    console.error("Products load error:", err);
  }
};

const loadSummary = async () => {
  try {
    const { data } = await api.get("/dashboard/summary", { params: params() });
    summary.value = data;
  } catch (err) {
    console.error("Summary load error:", err);
  }
};

const loadStats = async () => {
  try {
    const { data } = await api.get("/dashboard/stats", { params: params() });

    const period = filters.value.period;

    /* ===== YEAR ===== */
    if (period === "year") {
      const monthNames = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
        "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
      ];

      const earnData = new Array(12).fill(0);
      const spendData = new Array(12).fill(0);

      data.forEach((item) => {
        const date = new Date(item.label);
        const monthIndex = date.getMonth();
        earnData[monthIndex] = item.earn;
        spendData[monthIndex] = item.spend;
      });

      chartData.value.labels = monthNames;
      chartData.value.datasets[0].data = earnData;
      chartData.value.datasets[1].data = spendData;
    }

    /* ===== MONTH ===== */
    else if (period === "month") {
      const daysInMonth = new Date(
        filters.value.year,
        filters.value.month,
        0
      ).getDate();

      const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      const earnData = new Array(daysInMonth).fill(0);
      const spendData = new Array(daysInMonth).fill(0);

      data.forEach((item) => {
        const date = new Date(item.label);
        const dayIndex = date.getDate() - 1;
        earnData[dayIndex] = item.earn;
        spendData[dayIndex] = item.spend;
      });

      chartData.value.labels = labels;
      chartData.value.datasets[0].data = earnData;
      chartData.value.datasets[1].data = spendData;
    }

    /* ===== DAY (1 KUN) ===== */
    else if (period === "day") {
      chartData.value.labels = ["Tanlangan kun"];
      chartData.value.datasets[0].data = [data[0]?.earn || 0];
      chartData.value.datasets[1].data = [data[0]?.spend || 0];
    }

    /* ===== WEEK ===== */
    else if (period === "week") {
      const labels = ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"];
      const earnData = new Array(7).fill(0);
      const spendData = new Array(7).fill(0);

      data.forEach((item) => {
        const date = new Date(item.label);
        const dayIndex = (date.getDay() + 6) % 7; // ISO week
        earnData[dayIndex] = item.earn;
        spendData[dayIndex] = item.spend;
      });

      chartData.value.labels = labels;
      chartData.value.datasets[0].data = earnData;
      chartData.value.datasets[1].data = spendData;
    }
  } catch (err) {
    console.error("Chart load error:", err);
  }
};


const loadLatest = async () => {
  try {
    const { data } = await api.get("/dashboard/latest", { params: params() });
    latest.value = data.map(tx => {
      const productNames = tx.items?.map(i => i.product?.name).join(", ");
      const totalAmount = tx.items?.reduce((sum, i) => sum + i.amount, 0);
      return {
        ...tx,
        productName: productNames || "",
        amount: totalAmount || 0,
        filialName: tx.filial?.name || "",
      };
    });
  } catch (err) {
    console.error("Latest load error:", err);
  }
};

/* RELOAD ALL DATA */
const reloadAll = async () => {
  loading.value = true;
  try {
    await Promise.all([loadSummary(), loadStats(), loadLatest()]);
  } catch (err) {
    console.error("Dashboard load error:", err);
  } finally {
    loading.value = false;
  }
};

/* EXCEL EXPORT */
const exportExcel = async () => {
  const rows = latest.value.map((i) => ({
    Sana: formatDate(i.createdAt),
    Foydalanuvchi: i.user?.fullname,
    Mahsulot: i.productName,
    Filial: i.filialName,
    Turi: i.type === 'earn' ? 'Tushum' : 'Xarajat',
    Summa: i.amount,
  }));
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  XLSX.writeFile(wb, "transactions.xlsx");
};

/* WATCH FILTERS */
watch(filters, reloadAll, { deep: true });
/* WATCH FILIAL FILTER */
watch(() => filters.value.filial, async () => {
  await loadProducts(); // filial o'zgarganda productlarni yangilash
  await reloadAll();    // dashboard ma'lumotlarini yangilash
});

/* ON MOUNT */
onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([loadFilials(), loadProducts()]);
    await reloadAll();
  } finally {
    loading.value = false;
  }
});
</script>
