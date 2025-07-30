import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RedirectPage from "./pages/RedirectPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:shortcode" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}
