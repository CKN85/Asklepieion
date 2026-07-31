import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import HallPage from "./pages/HallPage.jsx";
import TabletPage from "./pages/TabletPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/hall/:hallId" element={<HallPage />} />
      <Route path="/tablet/:slug" element={<TabletPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
