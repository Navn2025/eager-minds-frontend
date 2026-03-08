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
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Enquiries</h1>

      <div className="grid lg:grid-cols-3 gap-6 min-h-[600px]">
        {/* List */}
        <div className="lg:col-span-1 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {items.map((enq) => (
            <div
              key={enq.id as string}
              onClick={() => setSelectedId(enq.id as string)}
              className={`
                cursor-pointer rounded-xl p-4 transition-all
                ${
                  selectedId === enq.id
                    ? "bg-indigo-600/20 border-indigo-500/50 border"
                    : "bg-white/5 border border-white/10 hover:bg-white/[0.07]"
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-white">
                    {enq.parentName as string}
                  </p>
                  <p className="text-xs text-white/50 mt-0.5">
                    {enq.email as string}
                  </p>
                </div>
                <span className="text-xs text-white/30">
                  {new Date(enq.createdAt as string).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-white/60 mt-2 line-clamp-2">
                {enq.message as string}
              </p>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-12">
              <Mail size={48} className="mx-auto text-white/10 mb-4" />
              <p className="text-sm text-white/50">No enquiries yet.</p>
            </div>
          )}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selected.parentName as string}
                  </h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <Mail size={14} />
                      {selected.email as string}
                    </span>
                    {selected.phone ? (
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {selected.phone as string}
                      </span>
                    ) : null}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(selected.id as string)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Delete enquiry"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/40">
                <Calendar size={14} />
                Received on{" "}
                {new Date(selected.createdAt as string).toLocaleString()}
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-sm font-medium text-white/50 mb-2">
                  Message
                </p>
                <p className="text-white leading-relaxed whitespace-pre-wrap">
                  {selected.message as string}
                </p>
              </div>

              <div className="flex gap-2">
                <a
                  href={`mailto:${selected.email as string}`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Reply via Email
                </a>
                {selected.phone ? (
                  <a
                    href={`tel:${selected.phone as string}`}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    Call
                  </a>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <Mail size={64} className="mx-auto text-white/10 mb-4" />
              <p className="text-white/50">Select an enquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
