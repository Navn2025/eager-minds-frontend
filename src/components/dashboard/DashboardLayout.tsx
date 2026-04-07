import { useEffect, useRef, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardSidebar from "./DashboardSidebar";
import { Menu, X } from "lucide-react";
import HeroBackground from "../ui/HeroBackground";

export default function DashboardLayout() {
  const { isLoggedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background relative font-sans">
      <HeroBackground />

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-8 right-8 z-50 w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95 transition-all"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <DashboardSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-grow flex flex-col h-full min-w-0 relative z-10 bg-transparent">
        <main
          ref={mainRef}
          className="flex-grow overflow-y-auto p-4 md:p-8 lg:p-12 pb-32 lg:pb-12 scrollbar-thin"
        >
          <div className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
