import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Trash2,
  Shield,
  User as UserIcon,
  Search,
  MoreVertical,
  Mail,
  Calendar,
} from "lucide-react";
import { Button } from "../../components/ui/Button";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    api
      .get("/auth/users")
      .then((res) => {
        setUsers(res.data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(fetchUsers, []);

  const changeRole = async (userId: string, role: string) => {
    await api.patch(`/auth/users/${userId}/role`, { role });
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
  };

  const deleteUser = async (userId: string, name: string) => {
    if (
      !confirm(
        `Permanently terminate user "${name}"? This action is irreversible.`,
      )
    )
      return;
    await api.delete(`/auth/users/${userId}`);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 md:space-y-12 pb-20"
    >
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-accent">
            <Shield size={12} className="text-accent" />
            <span>Identity Protocol Active</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9]">
            User <span className="text-white/20">Management.</span>
          </h1>
          <p className="text-text-secondary text-base md:text-xl font-medium max-w-xl leading-relaxed">
            Manage authentication nodes and authority clearance across the Eager
            Minds grid.
          </p>
        </div>

        <div className="relative group w-full xl:w-96">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search neural signatures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 md:h-16 pl-14 pr-8 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl text-white placeholder:text-white/20 outline-none focus:border-accent/40 transition-all font-medium"
          />
        </div>
      </header>

      <div className="matte-card p-0 overflow-hidden">
        <div className="p-6 md:p-10 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">
                Active Nodes
              </h3>
              <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">
                {filteredUsers.length} Signature(s) Detected
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto w-full scrollbar-thin">
          <div className="min-w-[800px] p-6 md:p-10">
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                  <th className="px-8 pb-4">Subscriber Signature</th>
                  <th className="px-8 pb-4">Clearance Level</th>
                  <th className="px-8 pb-4">Sync Date</th>
                  <th className="px-8 pb-4 text-right">Directives</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((user, idx) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group cursor-default"
                    >
                      <td className="py-6 px-8 bg-white/[0.01] border-y border-l border-white/5 rounded-l-3xl group-hover:bg-white/[0.03] transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-accent group-hover:border-accent/40 border border-white/5 transition-all">
                            <UserIcon size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white uppercase tracking-tight">
                              {user.name}
                            </p>
                            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                              <Mail size={10} /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-8 bg-white/[0.01] border-y border-white/5 group-hover:bg-white/[0.03] transition-all">
                        <select
                          value={user.role}
                          onChange={(e) => changeRole(user.id, e.target.value)}
                          className="bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none focus:border-accent/40 transition-all appearance-none cursor-pointer hover:bg-white/10"
                        >
                          <option value="standard" className="bg-[#0a0a0f]">
                            Standard
                          </option>
                          <option value="premium" className="bg-[#0a0a0f]">
                            Premium
                          </option>
                          <option value="admin" className="bg-[#0a0a0f]">
                            Admin
                          </option>
                        </select>
                      </td>
                      <td className="py-6 px-8 bg-white/[0.01] border-y border-white/5 group-hover:bg-white/[0.03] transition-all">
                        <div className="flex items-center gap-2 text-[10px] text-white/40 font-black uppercase tracking-widest">
                          <Calendar size={12} />
                          {new Date(user.createdAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </div>
                      </td>
                      <td className="py-6 px-8 bg-white/[0.01] border-y border-r border-white/5 rounded-r-3xl text-right group-hover:bg-white/[0.03] transition-all">
                        <button
                          onClick={() => deleteUser(user.id, user.name)}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500/30 hover:text-red-500 hover:bg-red-500/10 transition-all shadow-xl ml-auto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-6">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(124,58,237,0.4)]" />
                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] animate-pulse">
                  Loading Members...
                </p>
              </div>
            )}

            {!loading && filteredUsers.length === 0 && (
              <div className="py-24 text-center flex flex-col items-center gap-8">
                <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10">
                  <UserIcon size={32} />
                </div>
                <div className="space-y-3">
                  <p className="text-[12px] text-white/40 font-black uppercase tracking-[0.3em]">
                    No Signaling Signatures
                  </p>
                  <p className="text-lg text-white/20 font-medium max-w-sm">
                    No identity nodes found matching the search criteria.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
