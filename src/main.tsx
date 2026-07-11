import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./app/App.tsx";
import AdminApp from "./app/AdminApp.tsx";
import "./styles/index.css";

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

requestAnimationFrame(() => {
  const splash = document.getElementById("app-splash");
  if (!splash) return;
  splash.setAttribute("data-hide", "true");
  window.setTimeout(() => splash.remove(), 280);
});
