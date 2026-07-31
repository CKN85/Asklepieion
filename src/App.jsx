import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import TabletPage from "./pages/TabletPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tablet/:slug" element={<TabletPage />} />
    </Routes>
  );
}
