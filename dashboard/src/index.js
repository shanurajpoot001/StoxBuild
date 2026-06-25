import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import "./responsive.css";
import "./animations.css";
import Home from "./components/Home";
import FloatingAiBot from "./components/FloatingAiBot";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
    <FloatingAiBot />
  </React.StrictMode>
);
