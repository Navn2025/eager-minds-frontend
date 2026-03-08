import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  multiple?: boolean;
  onFilesSelect?: (files: FileList | null) => void;
  label?: string;
  accept?: string;
}

export function ImageUpload({
  onFileSelect,
  multiple = false,
  onFilesSelect,
  label = "Upload Image",
  accept = "image/*",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      if (multiple && onFilesSelect) {
        onFilesSelect(files);
        const newPreviews = Array.from(files).map((file) =>
          URL.createObjectURL(file),
        );
        setPreviews(newPreviews);
      } else {
        const file = files[0];
        onFileSelect(file);
        if (file.type.startsWith("image/")) {
          setPreview(URL.createObjectURL(file));
        } else {
          setPreview(null);
        }
      }
    },
    [multiple, onFileSelect, onFilesSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileChange(e.dataTransfer.files);
    },
    [handleFileChange],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const clearFile = useCallback(() => {
    setPreview(null);
    setPreviews([]);
    onFileSelect(null);
    if (onFilesSelect) onFilesSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [onFileSelect, onFilesSelect]);

  const removePreview = useCallback((index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-white/70 uppercase tracking-wider">
        {label}
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300
          ${
            isDragging
              ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]"
              : "border-white/10 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05]"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          title="Choose file to upload"
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {!preview && previews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 px-6 flex flex-col items-center justify-center gap-4"
            >
              <div
                className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
                  ${isDragging ? "bg-indigo-500/20 text-indigo-400 scale-110" : "bg-white/5 text-white/30"}
                `}
              >
                <Upload size={28} strokeWidth={1.5} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-white/60">
                  {isDragging
                    ? "Drop your file here"
                    : "Click to upload or drag & drop"}
                </p>
                <p className="text-xs text-white/30">
                  {multiple
                    ? "Multiple files supported"
                    : "PNG, JPG, WEBP up to 10MB"}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4"
            >
              {preview && !multiple && (
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                    <button
                      type="button"
                      title="Change image"
                      onClick={(e) => {
                        e.stopPropagation();
                        inputRef.current?.click();
                      }}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <ImageIcon size={18} className="text-white" />
                    </button>
                    <button
                      type="button"
                      title="Remove image"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile();
                      }}
                      className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors"
                    >
                      <X size={18} className="text-red-400" />
                    </button>
                  </div>
                </div>
              )}

              {multiple && previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((p, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img
                        src={p}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        title="Remove image"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePreview(i);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  ))}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      inputRef.current?.click();
                    }}
                    className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-white/30 flex items-center justify-center transition-colors bg-white/[0.02] hover:bg-white/[0.05]"
                  >
                    <Plus size={24} className="text-white/30" />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {(preview || previews.length > 0) && (
        <button
          type="button"
          onClick={clearFile}
          className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

// PDF Upload variant
export function FileUpload({
  onFileSelect,
  label = "Upload PDF",
  accept = ".pdf",
}: {
  onFileSelect: (file: File | null) => void;
  label?: string;
  accept?: string;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) {
      setFileName(null);
      onFileSelect(null);
      return;
    }
    const file = files[0];
    setFileName(file.name);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const clearFile = () => {
    setFileName(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-white/70 uppercase tracking-wider">
        {label}
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed py-8 px-6 transition-all duration-300
          ${
            isDragging
              ? "border-indigo-500 bg-indigo-500/10"
              : "border-white/10 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05]"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          title="Choose file to upload"
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
        />

        <div className="flex items-center gap-4">
          <div
            className={`
              w-12 h-12 rounded-xl flex items-center justify-center transition-all
              ${fileName ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/30"}
            `}
          >
            <Upload size={24} />
          </div>
          <div className="flex-1 min-w-0">
            {fileName ? (
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white truncate">
                  {fileName}
                </p>
                <button
                  type="button"
                  title="Remove file"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="p-1 hover:bg-red-500/20 rounded transition-colors"
                >
                  <X size={14} className="text-red-400" />
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-white/60">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-white/30">PDF files up to 20MB</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
