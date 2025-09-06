import "../index.js"
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { Button, Tooltip, Divider, } from "@mui/material";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import pageConfig from "./config";
import { MOCK_DATA } from "./mokedata";
import FilterPanel from "./FilterPanel";
import {
  applyFilters,
  exportCSV,
  exportExcel,
  exportPDF,
  exportQuickBooksJSON,
  exportFMCSAPdf,
} from "./helpers";

export default function DriverTablePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: pageConfig.filters.find((f) => f.key === "status")?.defaultValue ?? "all",
    location: pageConfig.filters.find((f) => f.key === "location")?.defaultValue ?? "",
    dateRange: pageConfig.filters.find((f) => f.key === "dateRange")?.defaultValue ?? { preset: "all" },
  });

  const [filtersOpen, setFiltersOpen] = useState(true);
  const filteredData = useMemo(() => {
  const result = applyFilters(rawData, filters);
  console.log("Filters:", filters);
  console.log("Raw Data Count:", rawData.length);
  console.log("Filtered Data Count:", result.length);
  return result;
}, [rawData, filters]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        if (pageConfig.dataSource.mode === "api") {
          const res = await fetch(pageConfig.dataSource.apiUrl);
          const json = await res.json();
          if (isMounted) setRawData(Array.isArray(json) ? json : json?.data ?? []);
        } else {
          if (isMounted) setRawData(MOCK_DATA);
        }
      } catch (err) {
        console.error("Data load error:", err);
        if (isMounted) setRawData([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const columns = useMemo(
    () =>
      pageConfig.columns.map((c) => ({
        accessorKey: c.accessorKey,
        header: t(c.headerKey),
        size: c.size,
      })),
    [t]
  );

  const onResetFilters = () =>
    setFilters({
      status: pageConfig.filters.find((f) => f.key === "status")?.defaultValue ?? "all",
      location: pageConfig.filters.find((f) => f.key === "location")?.defaultValue ?? "",
      dateRange: pageConfig.filters.find((f) => f.key === "dateRange")?.defaultValue ?? { preset: "last30" },
    });

  const handleExport = (type) => {
    const rows = filteredData;
    if (!rows.length) return;
    switch (type) {
      case "csv":
        return exportCSV(rows, "drivers.csv");
      case "excel":
        return exportExcel(rows, "drivers.xlsx");
      case "pdf":
        return exportPDF(rows, t("exports.pdf.title", { defaultValue: "Drivers" }), "drivers.pdf");
      case "qb":
        return exportQuickBooksJSON(rows, "quickbooks.json");
      case "fmcsa":
        return exportFMCSAPdf(rows, "fmcsa.pdf");
      default:
        return;
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
        <Button className="rounded-2xl"
        variant="outlined" onClick={() => navigate(-1)} 
        style={{ marginBottom: "1rem", marginRight: "10px", backgroundColor: "#007bff", color: "white"}}>
       Back
     </Button>
          <h1 className="text-2xl font-semibold">{t("drivers.page.title", { defaultValue: "Drivers" })}</h1>
        </div>
        

        {/* Export Controls */}
        <div className="flex flex-wrap gap-2">
          {pageConfig.exports.csv && (
            <Tooltip title={t("exports.csv")}>
              <Button variant="outlined" startIcon={<Download />} onClick={() => handleExport("csv")} className="rounded-2xl">CSV</Button>
            </Tooltip>
          )}
          {pageConfig.exports.excel && (
            <Tooltip title={t("exports.excel")}>
              <Button variant="outlined" startIcon={<Download />} onClick={() => handleExport("excel")} className="rounded-2xl">Excel</Button>
            </Tooltip>
          )}
          {pageConfig.exports.pdf && (
            <Tooltip title={t("exports.pdf")}>
              <Button variant="outlined" startIcon={<Download />} onClick={() => handleExport("pdf")} className="rounded-2xl">PDF</Button>
            </Tooltip>
          )}
          {pageConfig.exports.quickbooksJson && (
            <Tooltip title={t("exports.quickbooks")}>
              <Button variant="outlined" startIcon={<Download />} onClick={() => handleExport("qb")} className="rounded-2xl">QuickBooks</Button>
            </Tooltip>
          )}
          {pageConfig.exports.fmcsaPdf && (
            <Tooltip title={t("exports.fmcsa")}>
              <Button variant="outlined" startIcon={<Download />} onClick={() => handleExport("fmcsa")} className="rounded-2xl">FMCSA</Button>
            </Tooltip>
          )}
          <Divider orientation="vertical" flexItem className="hidden md:block" />
          <Button
            variant={filtersOpen ? "contained" : "outlined"}
            onClick={() => setFiltersOpen((s) => !s)}
            className="rounded-2xl"
            style={{marginBottom: "20px", marginTop: "20px"}}
          >
            {t("drivers.page.filters", { defaultValue: "Filters" })}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {filtersOpen && (
        <div className="mb-4">
          <FilterPanel
            config={pageConfig}
            value={filters}
            onChange={setFilters}
            onReset={onResetFilters}
          />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm">
        <MaterialReactTable
          columns={columns}
          data={filteredData}
          state={{ isLoading: loading }}
          enableSorting
          enableStickyHeader
          enableColumnResizing
          initialState={{ density: "compact" }}
          muiTableContainerProps={{ sx: { maxHeight: 600 } }}
          muiTableHeadCellProps={{ sx: { fontWeight: 600 } }}
        />
      </div>

      {/* Footer Note */}
      <p className="text-xs text-gray-500 mt-3">
        {t("drivers.page.dataSource", { defaultValue: "Data source" })}: {pageConfig.dataSource.mode}
      </p>
    </div>
  );
}
