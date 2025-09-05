import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DriverTablePage from "./pages/DriverTablePage";

function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Home Page</h1>
      <Link to="/drivers">
        <button>Go to Driver Table</button>
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
