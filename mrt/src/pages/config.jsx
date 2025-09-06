const pageConfig = {
    i18nBase: "drivers",
    dataSource: {
      mode: "mock",
      apiUrl: "/api/drivers",
    },
    columns: [
      { accessorKey: "id", headerKey: "drivers.table.headers.id", size: 80 },
      { accessorKey: "name", headerKey: "drivers.table.headers.name", size: 180 },
      { accessorKey: "status", headerKey: "drivers.table.headers.status", size: 120 },
      { accessorKey: "location", headerKey: "drivers.table.headers.location", size: 160 },
      { accessorKey: "licenseNumber", headerKey: "drivers.table.headers.license", size: 160 },
      { accessorKey: "createdAt", headerKey: "drivers.table.headers.createdAt", size: 180 },
    ],
    filters: [
      {
        key: "status",
        type: "select",
        labelKey: "filters.status",
        defaultValue: "all",
        options: [
          { labelKey: "filters.status_all", value: "all" },
          { labelKey: "filters.status_active", value: "Active" },
          { labelKey: "filters.status_inactive", value: "Inactive" },
        ],
      },
      {
        key: "location",
        type: "text",
        labelKey: "filters.location",
        placeholderKey: "filters.location_placeholder",
        defaultValue: "",
      },
      {
        key: "dateRange",
        type: "dateRange",
        labelKey: "filters.dateRange",
        presets: [
          { labelKey: "filters.presets.all", value: "all" },
          { labelKey: "filters.presets.last7", value: "last7" },
          { labelKey: "filters.presets.last30", value: "last30" },
          { labelKey: "filters.presets.thisQuarter", value: "thisQuarter" },
          { labelKey: "filters.presets.custom", value: "custom" },
        ],
        defaultValue: { preset: "all", start: null, end: null },
      },
    ],
    exports: {
      csv: true,
      excel: true,
      pdf: true,
      quickbooksJson: true,
      fmcsaPdf: true,
    },
  };
  
  export default pageConfig;
  