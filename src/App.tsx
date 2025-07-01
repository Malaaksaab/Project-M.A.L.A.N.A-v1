import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { Toaster } from "@/components/ui/toaster";
import DownloadPage from "./components/DownloadPage";

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/download" element={<DownloadPage />} />
        {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      <Toaster />
    </Suspense>
  );
}
