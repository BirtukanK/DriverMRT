import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      drivers: {
        page: {
          title: "Drivers",
          filters: "Filters",
          visible: "Visible",
          dataSource: "Data source",
        },
        table: {
          headers: {
            id: "ID",
            name: "Name",
            status: "Status",
            location: "Location",
            license: "License Number",
            createdAt: "Created At",
          },
        },
      },
      filters: {
        status: "Status",
        status_all: "All",
        status_active: "Active",
        status_inactive: "Inactive",
        location: "Location",
        location_placeholder: "Enter location",
        dateRange: "Date Range",
        presets: {
          all: "All",
          last7: "Last 7 Days",
          last30: "Last 30 Days",
          thisQuarter: "This Quarter",
          lastNYears: "Last N Years",
          custom: "Custom",
        },
        startDate: "Start Date",
        endDate: "End Date",
        nYears: "Years",
      },
      exports: {
        csv: "Export as CSV",
        excel: "Export as Excel",
        pdf: {
          title: "Drivers",
        },
        quickbooks: "Export to QuickBooks",
        fmcsa: "Export FMCSA PDF",
      },
      actions: {
        apply: "Apply",
        reset: "Reset",
        back: "Back",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, 
  },
});

export default i18n;
