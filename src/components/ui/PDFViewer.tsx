import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import {
  ZoomIn,
  ZoomOut,
  Loader2,
  AlertCircle,
  Download,
  BookOpen,
  X,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

interface PDFViewerProps {
  url: string;
  title?: string;
  className?: string;
  onClose?: () => void;
}

function PDFPageRenderer({
  pdf,
  pageNum,
  scale,
}: {
  pdf: pdfjsLib.PDFDocumentProxy;
  pageNum: number;
  scale: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    let active = true;

    const render = async () => {
      if (!canvasRef.current || !pdf) return;

      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (e) {}
      }

      try {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (context && active) {
          const outputScale = window.devicePixelRatio || 1;
          canvas.width = Math.floor(viewport.width * outputScale);
          canvas.height = Math.floor(viewport.height * outputScale);
          canvas.style.width = Math.floor(viewport.width) + "px";
          canvas.style.maxWidth = "100%";
          canvas.style.height = "auto";

          const renderContext: any = {
            canvasContext: context,
            viewport: viewport,
            transform:
              outputScale !== 1
                ? [outputScale, 0, 0, outputScale, 0, 0]
                : undefined,
          };

          const renderTask = page.render(renderContext);
          renderTaskRef.current = renderTask;
          await renderTask.promise;
        }
      } catch (err: any) {
        if (err?.name === "RenderingCancelledException") return;
      }
    };

    render();

    return () => {
      active = false;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (e) {}
      }
    };
  }, [pdf, pageNum, scale]);

  return (
    <div className="relative shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/5 bg-white select-none rounded-sm overflow-hidden mb-10 last:mb-0 shrink-0 max-w-full">
      <canvas ref={canvasRef} className="block group max-w-full" />

      {/* Sophisticated WatermarkOverlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02] select-none flex items-center justify-center z-10 mix-blend-multiply">
        <div className="rotate-[-35deg] whitespace-nowrap text-[12vw] font-black text-black tracking-tighter uppercase leading-none">
          Eager Minds Vault • Eager Minds Vault • Eager Minds Vault
        </div>
      </div>

      {/* Protection Layer / Interaction Shield */}
      <div className="absolute inset-0 z-20" />
    </div>
  );
}

export default function PDFViewer({
  url,
  title,
  className,
  onClose,
}: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const loadedPdf = await loadingTask.promise;
        setPdf(loadedPdf);
      } catch (err) {
        console.error("PDF Load Error:", err);
        setError(
          "Synchronization failed. This resource might be temporarily unavailable.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadPdf();
  }, [url]);

  useEffect(() => {
    // Lock body scrolling when the PDF viewer is open
    const originalStyles = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyles;
    };
  }, []);

  const handleZoom = (delta: number) => {
    setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  const preventActions = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col h-full bg-[#050505] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative select-none",
        className,
      )}
      onContextMenu={preventActions}
    >
      {/* Header / Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-10 py-4 sm:py-6 bg-white/[0.03] border-b border-white/5 backdrop-blur-3xl z-30 gap-4 sm:gap-0">
        <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 shrink-0">
            <BookOpen size={20} />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="text-sm font-black text-white uppercase tracking-tight truncate">
              {title || "Secure Document"}
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 truncate">
                Secured Node v4.0
              </span>
            </div>
          </div>
          {/* Mobile onClose button */}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close PDF viewer"
              title="Close"
              className="sm:hidden w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center text-white/40 hover:text-white hover:bg-red-500/20 transition-all border border-white/5 shrink-0"
            >
              <X size={18} strokeWidth={3} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-6 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {/* Pagination */}
          <div className="flex items-center gap-4 bg-black/40 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 border border-white/5 shrink-0">
            <div className="flex flex-col items-center">
              <span className="text-[10px] sm:text-xs text-white font-black tracking-tighter">
                {pdf?.numPages || 0} Pages
              </span>
              <span className="text-[6px] sm:text-[7px] text-white/20 uppercase font-black tracking-widest mt-0.5">
                Continuous Scroll
              </span>
            </div>
          </div>

          <div className="w-px h-6 sm:h-8 bg-white/5 shrink-0" />

          {/* Zoom */}
          <div className="flex items-center gap-1 sm:gap-2 bg-black/40 rounded-xl sm:rounded-2xl px-2 py-1.5 border border-white/5 shrink-0">
            <button
              onClick={() => handleZoom(-0.25)}
              className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg sm:rounded-xl transition-all text-white/40 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut size={16} strokeWidth={3} />
            </button>
            <span className="text-[9px] sm:text-[10px] text-white font-black w-8 sm:w-10 text-center tracking-tighter">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => handleZoom(0.25)}
              className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg sm:rounded-xl transition-all text-white/40 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn size={16} strokeWidth={3} />
            </button>
          </div>

          <div className="w-px h-6 sm:h-8 bg-white/5 hidden sm:block shrink-0" />

          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 transition-colors hover:bg-emerald-500/10 shrink-0">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/80">
              Vault Protection Active
            </span>
          </div>

          {/* Desktop onClose */}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close PDF viewer"
              title="Close"
              className="hidden sm:flex w-10 sm:w-12 h-10 sm:h-12 rounded-2xl bg-white/[0.05] items-center justify-center text-white/40 hover:text-white hover:bg-red-500/20 transition-all border border-white/5 shrink-0"
            >
              <X size={20} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-grow overflow-auto bg-[#070707] relative scroll-smooth py-12 px-2 md:px-12">
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40 backdrop-blur-xl"
            >
              <div className="relative">
                <Loader2
                  className="text-white/10 animate-spin"
                  size={80}
                  strokeWidth={1}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldAlert
                    className="text-white/40 animate-pulse"
                    size={24}
                  />
                </div>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.5em] font-black mt-8">
                Establishing Secure Session
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-40 p-10 text-center bg-black/90 backdrop-blur-2xl">
            <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-8 border border-red-500/20">
              <AlertCircle size={40} />
            </div>
            <h4 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
              Protocol Error
            </h4>
            <p className="text-white/40 text-sm max-w-sm leading-relaxed font-medium">
              {error}
            </p>
            <Button
              variant="ghost"
              className="mt-10 h-14 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em]"
              onClick={() => window.location.reload()}
            >
              Retry Link
            </Button>
          </div>
        )}

        {/* Render All Pages */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: loading ? 0 : 1, scale: loading ? 0.98 : 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center w-fit min-w-full pb-20 origin-top"
        >
          {pdf &&
            Array.from({ length: pdf.numPages }).map((_, index) => (
              <PDFPageRenderer
                key={index}
                pdf={pdf}
                pageNum={index + 1}
                scale={scale}
              />
            ))}
        </motion.div>
      </div>

      {/* Action Footer */}
      <div className="px-4 sm:px-10 py-4 sm:py-5 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between z-30 gap-4 sm:gap-0">
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-10">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="text-[7px] sm:text-[9px] uppercase font-black tracking-[0.3em] text-white/20 text-center">
              Encryption: AES-256 GCM
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="text-[7px] sm:text-[9px] uppercase font-black tracking-[0.3em] text-white/20 text-center">
              Access Token: EXPIRED_SESSION_GHOST
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-red-500/40">
          <Download size={12} strokeWidth={3} />
          <span className="text-[7px] sm:text-[9px] uppercase font-black tracking-[0.3em]">
            Exfiltration Blocked
          </span>
        </div>
      </div>
    </div>
  );
}
