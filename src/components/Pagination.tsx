import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageButton = (p: number) => (
    <button
      key={p}
      onClick={() => onPageChange(p)}
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
        p === page
          ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          : "bg-white/5 text-white/40 border border-white/5 hover:border-white/20 hover:text-white",
      )}
    >
      {p}
    </button>
  );

  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, i) => start + i,
  ).filter((p) => p <= totalPages);

  return (
    <div className="flex items-center justify-center gap-3 mt-16">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/5 text-white/40 disabled:opacity-20 hover:border-white/20 hover:text-white transition-all transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      {pageNumbers.map(renderPageButton)}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/5 text-white/40 disabled:opacity-20 hover:border-white/20 hover:text-white transition-all transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
