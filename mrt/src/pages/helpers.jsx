import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { mkConfig, generateCsv, download } from "export-to-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

dayjs.extend(isBetween);
dayjs.extend(quarterOfYear);

export function applyFilters(rows, filters) {
  const { status = "all", location = "", dateRange = { preset: "all", start: null, end: null } } = filters;

  let out = [...rows];

  // status filter
  if (status && status !== "all") {
    out = out.filter((r) => r.status === status);
  }

  // location text search (case-insensitive contains)
  if (location && location.trim().length > 0) {
    const q = location.trim().toLowerCase();
    out = out.filter((r) => `${r.location}`.toLowerCase().includes(q));
  }

  // date range
  const now = dayjs();
  let start = null;
  let end = null;

  switch (dateRange?.preset) {
    case "all":
      start = null;
      end = null;
      break;
    case "last7":
      start = now.subtract(7, "day").startOf("day");
      end = now.endOf("day");
      break;
    case "last30":
      start = now.subtract(30, "day").startOf("day");
      end = now.endOf("day");
      break;
    case "thisQuarter": {
      const qStart = now.startOf("quarter");
      start = qStart.startOf("day");
      end = now.endOf("day");
      break;
    }
    case "lastNYears": {
      const n = dateRange?.nYears ?? 5;
      start = now.subtract(n, "year").startOf("day");
      end = now.endOf("day");
      break;
    }
    case "custom":
      start = dateRange?.start ? dayjs(dateRange.start).startOf("day") : null;
      end = dateRange?.end ? dayjs(dateRange.end).endOf("day") : null;
      break;
    
    default:
      break;
  }

  if (start || end) {
    out = out.filter((r) => {
      const d = dayjs(r.createdAt, ["YYYY-MM-DD", "YYYY/MM/DD", "MM/DD/YYYY"], true);
      if (!d.isValid()) return false;
      if (start && end) return d.isBetween(start, end, null, "[]");
      if (start) return d.isAfter(start) || d.isSame(start, "day");
      if (end) return d.isBefore(end) || d.isSame(end, "day");
      return true;
    });
  }

  return out;
}

export function exportCSV(rows, filename = "drivers.csv") {
  const csvConfig = mkConfig({ useKeysAsHeaders: true, filename });
  const csv = generateCsv(csvConfig)(rows);
  download(csvConfig)(csv);
}

export function exportExcel(rows, filename = "drivers.xlsx") {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Drivers");
  XLSX.writeFile(wb, filename);
}

export function exportPDF(rows, title = "Drivers", filename = "drivers.pdf", theme = { headStyles: { fillColor: [22, 160, 133] } }) {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(16);
  doc.text(title, 14, 18);
  const head = [Object.keys(rows[0] || {})];
  const body = rows.map((r) => head[0].map((k) => String(r[k] ?? "")));
  autoTable(doc, { head, body, startY: 24, styles: { fontSize: 8 }, theme: "grid", headStyles: theme.headStyles });
  doc.save(filename);
}

export function exportQuickBooksJSON(rows, filename = "quickbooks.json") {
  const vendors = rows.map((r) => ({
    DisplayName: r.name,
    Active: r.status === "Active",
    PrimaryAddr: { City: r.location?.split(", ")[0] || "" },
    AcctNum: r.licenseNumber,
    CreateTime: r.createdAt,
  }));
  const blob = new Blob([JSON.stringify({ Vendors: vendors }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportFMCSAPdf(rows, filename = "fmcsa.pdf") {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("FMCSA Driver Roster", 14, 16);
  doc.setFontSize(10);
  const head = [["ID", "Name", "Status", "Location", "License", "Created At"]];
  const body = rows.map((r) => [r.id, r.name, r.status, r.location, r.licenseNumber, r.createdAt]);
  autoTable(doc, {
    head,
    body,
    startY: 22,
    theme: "striped",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [0, 82, 204] },
    margin: { left: 12, right: 12 },
  });
  doc.save(filename);
}
