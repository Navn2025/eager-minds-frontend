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
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <HeroBackground />

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-8 right-8 z-50 w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95 transition-all"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - z-10 to stay above background */}
      <AdminSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Content Area - z-10 and ensuring overflow-y-auto works on the scrollable child */}
      <div className="flex-grow flex flex-col h-full min-w-0 relative z-10 bg-transparent">
        <main
          ref={mainRef}
          className="flex-grow overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-12 scrollbar-thin"
        >
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
