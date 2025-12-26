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
  :total="total"
  :rows="limit"
  @page="onPage"
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

/* PAGINATION (LATEST TABLE) */
const page = ref(1);
const limit = ref(10);
const total = ref(0);


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
      // 🔹 pagination
    page: page.value,
    limit: limit.value,
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
    const { data } = await api.get("/dashboard/latest", {
      params: params(), // page va limit backendga boradi
    });

    // data.data => tranzaksiyalar, data.pagination => total
    latest.value = data.data.map((tx) => {
      const productNames = tx.items?.map((i) => i.product?.name).join(", ");
      const totalAmount = tx.items?.reduce((sum, i) => sum + i.amount, 0);

      return {
        ...tx,
        productName: productNames || "",
        amount: totalAmount || 0,
        filialName: tx.filial?.name || "",
      };
    });

    // pagination uchun total qaytariladi
    total.value = data.pagination.total;
  } catch (err) {
    console.error("Latest load error:", err);
  }
};

const onPage = (e) => {
  page.value = e.page + 1; // PrimeVue 0-based
  limit.value = e.rows;
  loadLatest();
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

const exportExcel = async () => {
  try {
    // 🔹 Hamma ma’lumotni olish uchun limit va page’ni olib tashlaymiz
    const { data } = await api.get("/dashboard/latest", {
      params: {
        ...params(),
        page: 1,
        limit: 1000000, // juda katta limit — barcha ma’lumotlarni olish uchun
      },
    });

    const rows = data.data.map((i, index) => ({
      "№": index + 1,
      "Sana": formatDate(i.createdAt),
      "Foydalanuvchi": i.user?.fullname || "-",
      "Mahsulot": i.items?.map(it => it.product?.name).join(", ") || "",
      "Filial": i.filial?.name || "",
      "Turi": i.type === "earn" ? "Tushum" : "Xarajat",
      "Summa (so'm)": i.items?.reduce((sum, it) => sum + it.amount, 0) || 0,
    }));

    const XLSX = await import("xlsx");

    const ws = XLSX.utils.json_to_sheet(rows, { origin: "A2", skipHeader: true });

    const headers = Object.keys(rows[0]);
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

    // Header bold va markazlashtirish
    headers.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
      ws[cellAddress].s = {
        font: { bold: true },
        alignment: { horizontal: "center" },
      };
    });

    // Column widths
    ws["!cols"] = [
      { wch: 5 }, { wch: 14 }, { wch: 25 }, { wch: 22 },
      { wch: 20 }, { wch: 12 }, { wch: 16 },
    ];

    // Freeze header
    ws["!freeze"] = { xSplit: 0, ySplit: 1 };

    // Jami hisoblash
    let totalTushum = 0;
    let totalXarajat = 0;
    rows.forEach(row => {
      if (row.Turi === "Tushum") totalTushum += row["Summa (so'm)"];
      else totalXarajat += row["Summa (so'm)"];
    });

    // Jami qatorlarini qo‘shish
    const totalRowIndex = rows.length + 2;
    XLSX.utils.sheet_add_aoa(ws, [["", "", "", "", "", "Jami Tushum", totalTushum]], { origin: `A${totalRowIndex}` });
    XLSX.utils.sheet_add_aoa(ws, [["", "", "", "", "", "Jami Xarajat", totalXarajat]], { origin: `A${totalRowIndex + 1}` });

    // Summa ustunlarini raqam formatida ko‘rsatish
    [totalRowIndex, totalRowIndex + 1].forEach(rIndex => {
      const sumCellAddress = XLSX.utils.encode_cell({ r: rIndex - 1, c: 6 });
      if (ws[sumCellAddress]) {
        ws[sumCellAddress].s = {
          numFmt: "#,##0 \"so'm\"",
          alignment: { horizontal: "right" },
          font: { bold: true },
        };
      }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    XLSX.writeFile(wb, "transactions.xlsx");
  } catch (err) {
    console.error("Export Excel error:", err);
  }
};

/* WATCH FILTERS */
watch(filters, async () =>{
  page.value = 1;
  await reloadAll()
} , { deep: true });
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
