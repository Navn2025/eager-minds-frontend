import { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { 
  ChevronLeft, 
  ChevronRight, 
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
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  title?: string;
  className?: string;
  onClose?: () => void;
}

export default function PDFViewer({ url, title, className, onClose }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  const renderPage = useCallback(async (num: number, currentPdf: pdfjsLib.PDFDocumentProxy, currentScale: number) => {
    if (!canvasRef.current) return;
    setIsRendering(true);
    
    try {
      const page = await currentPdf.getPage(num);
      const viewport = page.getViewport({ scale: currentScale });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;
        
        const renderContext: any = {
          canvasContext: context,
          canvas: canvas,
          viewport: viewport,
          transform: transform,
        };
        
        await page.render(renderContext).promise;
      }
    } catch (err) {
      console.error("PDF Render Error:", err);
    } finally {
      setIsRendering(false);
    }
  }, []);

  useEffect(() => {
    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const loadedPdf = await loadingTask.promise;
        setPdf(loadedPdf);
        setPageNum(1);
        await renderPage(1, loadedPdf, scale);
      } catch (err) {
        console.error("PDF Load Error:", err);
        setError("Synchronization failed. This resource might be temporarily unavailable.");
      } finally {
        setLoading(false);
      }
    };
    loadPdf();
  }, [url, renderPage, scale]);

  useEffect(() => {
    if (pdf) {
      renderPage(pageNum, pdf, scale);
    }
  }, [pageNum, scale, pdf, renderPage]);

  const changePage = (offset: number) => {
    if (!pdf) return;
    const newPage = pageNum + offset;
    if (newPage >= 1 && newPage <= pdf.numPages) {
      setPageNum(newPage);
    }
  };

  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  const preventActions = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex flex-col h-full bg-[#050505] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative select-none",
        className
      )}
      onContextMenu={preventActions}
    >
      {/* Header / Controls */}
      <div className="flex items-center justify-between px-10 py-6 bg-white/[0.03] border-b border-white/5 backdrop-blur-3xl z-30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
            <BookOpen size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white uppercase tracking-tight truncate max-w-[300px]">{title || "Secure Document"}</h3>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Secured Node v4.0</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           {/* Pagination */}
           <div className="flex items-center gap-4 bg-black/40 rounded-2xl px-3 py-1.5 border border-white/5">
              <button 
                onClick={() => changePage(-1)}
                disabled={pageNum <= 1 || isRendering}
                className="p-2 hover:bg-white/5 rounded-xl disabled:opacity-30 transition-all text-white/40 hover:text-white"
                title="Previous Page"
              >
                <ChevronLeft size={18} strokeWidth={3} />
              </button>
              <div className="flex flex-col items-center min-w-16">
                 <span className="text-xs text-white font-black tracking-tighter">
                   {pageNum} <span className="text-white/20 px-1">/</span> {pdf?.numPages || "-"}
                 </span>
                 <span className="text-[7px] text-white/20 uppercase font-black tracking-widest mt-0.5">Page Range</span>
              </div>
              <button 
                onClick={() => changePage(1)}
                disabled={pdf ? pageNum >= pdf.numPages : true || isRendering}
                className="p-2 hover:bg-white/5 rounded-xl disabled:opacity-30 transition-all text-white/40 hover:text-white"
                title="Next Page"
              >
                <ChevronRight size={18} strokeWidth={3} />
              </button>
           </div>

           <div className="w-px h-8 bg-white/5" />

           {/* Zoom */}
           <div className="flex items-center gap-2 bg-black/40 rounded-2xl px-2 py-1.5 border border-white/5">
              <button onClick={() => handleZoom(-0.25)} className="p-2 hover:bg-white/5 rounded-xl transition-all text-white/40 hover:text-white" title="Zoom Out">
                <ZoomOut size={18} strokeWidth={3} />
              </button>
              <span className="text-[10px] text-white font-black w-10 text-center tracking-tighter">{Math.round(scale * 100)}%</span>
              <button onClick={() => handleZoom(0.25)} className="p-2 hover:bg-white/5 rounded-xl transition-all text-white/40 hover:text-white" title="Zoom In">
                <ZoomIn size={18} strokeWidth={3} />
              </button>
           </div>

           <div className="w-px h-8 bg-white/5" />

           <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 transition-colors hover:bg-emerald-500/10">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/80">Vault Protection Active</span>
           </div>

           {onClose && (
             <button 
                onClick={onClose}
                className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center text-white/40 hover:text-white hover:bg-red-500/20 transition-all border border-white/5"
              >
                <X size={20} strokeWidth={3} />
              </button>
           )}
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-grow overflow-auto flex justify-center bg-[#070707] relative p-12 scrollbar-none scroll-smooth">
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40 backdrop-blur-xl"
            >
              <div className="relative">
                 <Loader2 className="text-white/10 animate-spin" size={80} strokeWidth={1} />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldAlert className="text-white/40 animate-pulse" size={24} />
                 </div>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.5em] font-black mt-8">Establishing Secure Session</p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-40 p-10 text-center bg-black/90 backdrop-blur-2xl">
            <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-8 border border-red-500/20">
              <AlertCircle size={40} />
            </div>
            <h4 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Protocol Error</h4>
            <p className="text-white/40 text-sm max-w-sm leading-relaxed font-medium">{error}</p>
            <Button variant="ghost" className="mt-10 h-14 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em]" onClick={() => window.location.reload()}>Retry Link</Button>
          </div>
        )}

        {/* Canvas for rendering */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: loading ? 0 : 1, scale: loading ? 0.98 : 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/5 bg-white select-none rounded-sm overflow-hidden"
        >
           <canvas ref={canvasRef} className="block group" />
           
           {/* Sophisticated WatermarkOverlay */}
           <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02] select-none flex items-center justify-center z-10">
              <div className="rotate-[-35deg] whitespace-nowrap text-[12vw] font-black text-black tracking-tighter uppercase leading-none">
                 Eager Minds Vault • Eager Minds Vault • Eager Minds Vault
              </div>
           </div>
           
           {/* Protection Layer / Interaction Shield */}
           <div className="absolute inset-0 z-20" />
        </motion.div>
      </div>

      {/* Action Footer */}
      <div className="px-10 py-5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between z-30">
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-[9px] uppercase font-black tracking-[0.3em] text-white/20">Encryption: AES-256 GCM</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-[9px] uppercase font-black tracking-[0.3em] text-white/20">Access Token: EXPIRED_SESSION_GHOST</span>
            </div>
         </div>
         <div className="flex items-center gap-4 text-red-500/40">
            <Download size={12} strokeWidth={3} />
            <span className="text-[9px] uppercase font-black tracking-[0.3em]">Exfiltration Blocked</span>
         </div>
      </div>
    </div>
  );
}
