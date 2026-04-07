import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Menu, X } from "lucide-react";
import HeroBackground from "../ui/HeroBackground";

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background text-white">
      <HeroBackground />

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full flex items-center justify-center bg-linear-to-br from-accent to-accent-pink text-white shadow-[0_0_24px_rgba(168,85,247,0.35)] active:scale-95 transition-all"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - z-10 to stay above background */}
      <AdminSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Content Area - z-10 and ensuring overflow-y-auto works on the scrollable child */}
      <div className="grow flex flex-col h-full min-w-0 relative z-10 bg-linear-to-br from-white/1.5 via-transparent to-white/1">
        <main
          ref={mainRef}
          className="grow overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10 scrollbar-thin"
        >
          <div className="max-w-420 mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
