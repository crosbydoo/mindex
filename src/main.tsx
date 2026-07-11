import AdminApp from "@/app/AdminApp";
import App from "@/app/App";
import "@/styles/index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.warn("Service worker registration failed:", error);
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/mindex-console" element={<AdminApp />} />
      <Route path="/*" element={<App />} />
    </Routes>
  </BrowserRouter>,
);

const SPLASH_MIN_MS = 900;

window.setTimeout(() => {
  const splash = document.getElementById("app-splash");
  if (!splash) return;
  splash.setAttribute("data-hide", "true");
  window.setTimeout(() => splash.remove(), 400);
}, SPLASH_MIN_MS);
