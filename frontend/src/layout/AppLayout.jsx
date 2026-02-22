import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-300">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default AppLayout;
