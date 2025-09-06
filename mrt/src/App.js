import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DriverTablePage from "./pages/DriverTablePage";
import { Button } from "@mui/material";

function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Home Page</h1>
      <Link to="/drivers">
        <Button
        style={{ marginBottom: "1rem", marginRight: "10px", backgroundColor: "#007bff", color: "white"}}>
        Go to Driver Table</Button>
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drivers" element={<DriverTablePage />} />
      </Routes>
    </Router>
  );
}
