import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { Mail, Phone, Calendar, Trash2 } from "lucide-react";

export default function AdminEnquiries() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    api
      .get("/enquiries")
      .then((res) => setItems(res.data.enquiries || []))
      .catch(() => {});
  }, []);

  useEffect(fetchData, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    await api.delete(`/enquiries/${id}`);
    if (selectedId === id) setSelectedId(null);
    fetchData();
  };

  const selected = items.find((i) => i.id === selectedId);

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/2 text-[10px] font-black uppercase tracking-[0.3em] text-accent">
          <span>Inquiry Queue</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
          Enquiries.
        </h1>
        <p className="text-text-secondary text-base md:text-lg font-medium max-w-2xl leading-relaxed">
          Review incoming messages in the same glass-panel admin theme.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 min-h-150">
        {/* List */}
        <div className="lg:col-span-1 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
          {items.map((enq) => (
            <div
              key={enq.id as string}
              onClick={() => setSelectedId(enq.id as string)}
              className={`
                cursor-pointer rounded-[1.4rem] p-4 transition-all border
                ${
                  selectedId === enq.id
                    ? "bg-white/5 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
                    : "bg-white/2 border-white/5 hover:bg-white/4"
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-black text-white uppercase tracking-tight">
                    {enq.parentName as string}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">
                    {enq.email as string}
                  </p>
                </div>
                <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">
                  {new Date(enq.createdAt as string).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                {enq.message as string}
              </p>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-12 rounded-[1.4rem] border border-dashed border-white/10 bg-white/2">
              <Mail size={48} className="mx-auto text-white/10 mb-4" />
              <p className="text-sm text-white/50">No enquiries yet.</p>
            </div>
          )}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="matte-card p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                    {selected.parentName as string}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-text-secondary">
                    <span className="flex items-center gap-1 font-medium">
                      <Mail size={14} />
                      {selected.email as string}
                    </span>
                    {selected.phone ? (
                      <span className="flex items-center gap-1 font-medium">
                        <Phone size={14} />
                        {selected.phone as string}
                      </span>
                    ) : null}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(selected.id as string)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
                  title="Delete enquiry"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-white/35 font-black uppercase tracking-[0.2em]">
                <Calendar size={14} />
                Received on{" "}
                {new Date(selected.createdAt as string).toLocaleString()}
              </div>

              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 mb-2">
                  Message
                </p>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                  {selected.message as string}
                </p>
              </div>

              <div className="flex gap-2">
                <a
                  href={`mailto:${selected.email as string}`}
                  className="px-4 py-3 rounded-2xl bg-gradient-to-r from-accent to-accent-pink text-white text-[10px] font-black uppercase tracking-[0.22em] transition-all hover:scale-[1.01]"
                >
                  Reply via Email
                </a>
                {selected.phone ? (
                  <a
                    href={`tel:${selected.phone as string}`}
                    className="px-4 py-3 rounded-2xl bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.22em] border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    Call
                  </a>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="matte-card p-12 text-center rounded-[1.5rem]">
              <Mail size={64} className="mx-auto text-white/10 mb-4" />
              <p className="text-white/50">Select an enquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
