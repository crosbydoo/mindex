
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./app/App.tsx";
import AdminApp from "./app/AdminApp.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/mindex-console" element={<AdminApp />} />
      <Route path="/*" element={<App />} />
    </Routes>
  </BrowserRouter>,
);
