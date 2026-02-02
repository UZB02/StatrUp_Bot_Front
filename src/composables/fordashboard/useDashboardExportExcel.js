import api from '@/utils/api.js'

export function useDashboardExportExcel(params, formatDate) {
  const exportExcel = async () => {
    try {
      const { data } = await api.get('/dashboard/latest', {
        params: {
          ...params(),
          page: 1,
          limit: 999999999, // barcha ma'lumotlar
        },
      })

      const rows = data.data.map((i, index) => ({
        '№': index + 1,
        Sana: formatDate(i.createdAt),
        Foydalanuvchi: i.user?.fullname || '-',
        Mahsulot: i.items?.map((it) => it.product?.name).join(', ') || '',
        [`Miqdori (${i.items?.[0]?.product?.unit || ''})`]:
          i.items?.map((it) => it.quantity).join(', ') || '',
        Filial: i.filial?.name || '',
        Turi: i.type === 'earn' ? 'Tushum' : 'Xarajat',
        "Summa (so'm)": i.items?.reduce((sum, it) => sum + it.amount, 0) || 0,
      }))

      if (!rows.length) return

      const XLSX = await import('xlsx')

      const ws = XLSX.utils.json_to_sheet(rows, {
        origin: 'A2',
        skipHeader: true,
      })

      const headers = Object.keys(rows[0])
      XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' })

      // Header style
      headers.forEach((_, c) => {
        const cell = XLSX.utils.encode_cell({ r: 0, c })
        ws[cell].s = {
          font: { bold: true },
          alignment: { horizontal: 'center' },
        }
      })

      // Column width
      ws['!cols'] = [
        { wch: 5 },
        { wch: 14 },
        { wch: 25 },
        { wch: 24 },
        { wch: 22 },
        { wch: 20 },
        { wch: 12 },
        { wch: 16 },
      ]

      ws['!freeze'] = { ySplit: 1 }

      // Jami hisoblash
      let totalEarn = 0
      let totalSpend = 0

      rows.forEach((r) => {
        if (r.Turi === 'Tushum') totalEarn += r["Summa (so'm)"]
        else totalSpend += r["Summa (so'm)"]
      })

      const startRow = rows.length + 2

      XLSX.utils.sheet_add_aoa(ws, [['', '', '', '', '', '', 'Jami Tushum', totalEarn]], {
        origin: `A${startRow}`,
      })

      XLSX.utils.sheet_add_aoa(ws, [['', '', '', '', '', '', 'Jami Xarajat', totalSpend]], {
        origin: `A${startRow + 1}`,
      })

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Transactions')

      XLSX.writeFile(wb, 'transactions.xlsx')
    } catch (err) {
      console.error('Excel export error:', err)
    }
  }

  return { exportExcel }
}
