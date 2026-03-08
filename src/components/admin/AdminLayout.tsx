import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Menu, X } from "lucide-react";

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Background Layer - ensure it's at the back and completely non-interactive */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(139,92,246,0.05)_0%,rgba(0,0,0,0)_60%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(37,99,235,0.04)_0%,rgba(0,0,0,0)_60%)]" />
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-8 right-8 z-50 w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95 transition-all"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - z-10 to stay above background */}
      <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      {/* Content Area - z-10 and ensuring overflow-y-auto works on the scrollable child */}
      <div className="flex-grow flex flex-col h-full min-w-0 relative z-10 bg-transparent">
        <main className="flex-grow overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-12 scrollbar-thin">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
