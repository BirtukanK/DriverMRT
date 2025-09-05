import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialReactTable } from "material-react-table"
import { Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const mockData = [
    { id: 1, name: "John Doe", status: "Active", location: "New York", date: "2025-08-30" },
    { id: 2, name: "Jane Doe", status: "Inactive", location: "Los Angeles", date: "2025-08-15" },
    { id: 3, name: "Kevin Vandy", status: "Active", location: "Chicago", date: "2025-07-20" },
    { id: 4, name: "Joshua Rolluffs", status: "Inactive", location: "Houston", date: "2025-03-01" },
  ];

export default function DriverTablePage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredData = useMemo(() => {
    if (statusFilter === "All") return mockData;
    return mockData.filter((d) => d.status === statusFilter);
  }, [statusFilter]);

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "location", header: "Location" },
      { accessorKey: "date", header: "Date" },
    ],
    []
  );

  return (
    <div style={{ padding: "1rem" }}>
      <Button variant="outlined" onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        Back
      </Button>

      <FormControl style={{ minWidth: 200, marginBottom: "1rem" }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

      <MaterialReactTable
        columns={columns}
        data={filteredData}
        enableSorting
      />
    </div>
  );
}
