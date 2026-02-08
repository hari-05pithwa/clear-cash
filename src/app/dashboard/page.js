"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { calculateTotals } from "@/lib/calculations";
import { 
  Plus, Clock, Wallet, LayoutGrid, ArrowRight, Home, 
  PieChart, History, Settings, Globe, ShieldCheck,
  Fuel, Utensils, ShoppingBag, Layers, ArrowDownLeft, ChevronRight
} from "lucide-react";
import { motion, useSpring, useTransform } from "framer-motion";
import AddTransactionModal from "@/components/dashboard/AddTransactionModal";

// --- Dynamic Icon Logic ---
const getTransactionIcon = (type, category) => {
  if (category === "Food") return <Utensils size={20} />;
  if (category === "Petrol") return <Fuel size={20} />;
  if (category === "Shopping") return <ShoppingBag size={20} />;
  if (category === "Other") return <Layers size={20} />;
  if (type === "IPO_HOLD") return <Clock size={20} />;
  if (type === "LENT") return <Wallet size={20} />;
  if (type === "RECEIVED" || type === "INITIAL") return <ArrowDownLeft size={20} />;
  return <Layers size={20} />;
};

function MoneyCounter({ value }) {
  const spring = useSpring(value || 0, { mass: 1, stiffness: 100, damping: 22 });
  const display = useTransform(spring, (current) => 
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(current)
  );

  useEffect(() => {
    spring.set(value || 0);
  }, [value, spring]);

  return (
    <motion.span className="inline-block text-white">
      <motion.span>{display}</motion.span>
    </motion.span>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [userName, setUserName] = useState({ first: "", last: "" });
  const router = useRouter();

  const fetchTransactions = async () => {
    try {
      const userId = localStorage.getItem("cc_user_id");
      if (!userId) { router.push("/onboarding"); return; }
      const res = await fetch(`/api/transactions?userId=${userId}`);
      if (!res.ok) throw new Error("API failed");
      const json = await res.json();
      if (json && Array.isArray(json)) {
        const stats = calculateTotals(json);
        setData({ transactions: json, stats });
      }
    } catch (error) {
      console.error("Vault Connection Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const first = localStorage.getItem("cc_first_name");
    const last = localStorage.getItem("cc_last_name");
    if (first) setUserName({ first, last: last || "" });
    fetchTransactions();
  }, [refreshKey]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-blue-600 font-black text-2xl tracking-tighter">CC</motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] p-6 pb-44 text-slate-900 overflow-x-hidden">
      <header className="pt-6 flex justify-between items-center mb-8 px-1">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-slate-900 rounded-[1.2rem] flex items-center justify-center shadow-lg"><span className="text-white text-sm font-black uppercase tracking-tighter">CC</span></div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Private Vault</p>
            <h2 className="font-black text-lg tracking-tight text-slate-900 line-clamp-1">{userName.first} {userName.last}</h2>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => router.push("/settings")} className="w-11 h-11 bg-white shadow-lg rounded-[1.2rem] flex items-center justify-center border border-slate-50">
          <LayoutGrid size={18} className="text-slate-400" />
        </motion.button>
      </header>

      {/* Cards Section */}
      <section className="space-y-4 mb-8">
        <div className="relative overflow-hidden bg-slate-900 rounded-[2.8rem] p-8 text-white shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-60"><Globe size={14} className="text-blue-400" /><span className="text-[10px] font-black uppercase tracking-[0.15em]">Total Bank Balance</span></div>
            <h2 className="text-5xl font-black tracking-tighter mb-5"><MoneyCounter value={data.stats.bankBalance} /></h2>
            <div className="flex justify-between items-center pt-5 border-t border-white/5 opacity-40"><p className="text-[9px] font-black uppercase tracking-widest">Active Ledger</p><ArrowRight size={16} /></div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.8rem] p-8 text-white shadow-2xl shadow-emerald-100/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-90"><ShieldCheck size={14} /><span className="text-[10px] font-black uppercase tracking-[0.15em]">Safe to Spend</span></div>
            <h2 className="text-5xl font-black tracking-tighter mb-5"><MoneyCounter value={data.stats.safeToSpend} /></h2>
            <div className="flex justify-between items-center pt-5 border-t border-white/10 opacity-90"><p className="text-[9px] font-black uppercase tracking-widest">Available Assets</p></div>
          </div>
        </div>
      </section>

      {/* RECENT ACTIVITY WITH BLUR FADE */}
      <section className="mb-12 px-1 relative">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-xl font-black tracking-tight text-slate-900 uppercase">Recent activity</h3>
           <span className="text-[8px] font-black uppercase text-slate-300 tracking-widest">Last 5 Entries</span>
        </div>

        <div className="relative">
          <div className="space-y-7 pb-12">
            {data.transactions.slice(0, 5).map((tx, i) => (
              <motion.div key={tx._id} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-[1.4rem] flex items-center justify-center shadow-sm ${tx.type === 'SPEND' ? 'bg-slate-50 text-slate-900' : tx.type === 'IPO_HOLD' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {getTransactionIcon(tx.type, tx.category)}
                  </div>
                  <div>
                    <h4 className="font-black text-[15px] text-slate-800 line-clamp-1 mb-0.5">{tx.name}</h4>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{tx.category || "General"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[15px] font-black ${tx.type === 'RECEIVED' || tx.type === 'INITIAL' ? 'text-emerald-600' : 'text-red-400'}`}>
                    {tx.type === 'RECEIVED' || tx.type === 'INITIAL' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-[8px] font-black text-slate-200 uppercase mt-0.5">{formatDate(tx.timestamp)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* THE BLUR FADE OVERLAY */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FDFDFF] via-[#FDFDFF]/80 to-transparent z-10 flex items-end justify-center">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/history")}
              className="mb-2 bg-white border border-slate-100 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 active:bg-slate-50 transition-colors"
            >
              <History size={14} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">View Full History</span>
              <ChevronRight size={14} className="text-slate-300" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* FAB */}
      <div className="fixed bottom-32 left-0 right-0 flex justify-center z-[100] pointer-events-none px-6">
        <motion.button 
          whileTap={{ scale: 0.95 }} onClick={() => setIsModalOpen(true)}
          className="pointer-events-auto w-full max-w-[200px] bg-slate-900 text-white py-5 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center justify-center gap-3 border border-white/10 active:bg-blue-600 transition-all"
        >
          <Plus size={22} strokeWidth={4} /><span className="text-[11px] font-black uppercase tracking-[0.15em]">New Entry</span>
        </motion.button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-50 px-10 py-5 pb-10 z-[90] flex justify-between items-center shadow-2xl">
        <button className="flex flex-col items-center gap-1.5 text-blue-600 outline-none"><Home size={26} strokeWidth={2.5} /><span className="text-[9px] font-black uppercase tracking-tighter">Vault</span></button>
        <button onClick={() => router.push("/insights")} className="flex flex-col items-center gap-1.5 text-slate-300 outline-none"><PieChart size={26} /><span className="text-[9px] font-black uppercase tracking-tighter">Insights</span></button>
        <button onClick={() => router.push("/history")} className="flex flex-col items-center gap-1.5 text-slate-300 outline-none"><History size={26} /><span className="text-[9px] font-black uppercase tracking-tighter">Archive</span></button>
        <button onClick={() => router.push("/settings")} className="flex flex-col items-center gap-1.5 text-slate-300 outline-none"><Settings size={26} /><span className="text-[9px] font-black uppercase tracking-tighter">Vault ID</span></button>
      </nav>

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={() => setRefreshKey(prev => prev + 1)} />
    </div>
  );
}