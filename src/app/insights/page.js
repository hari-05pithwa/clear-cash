"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PieChart as RePie, Pie, Cell, ResponsiveContainer } from "recharts";
import { Target, TrendingDown, Home, PieChart, History, Settings, BarChart3, Sparkles, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Insights() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/insights").then(res => res.json()).then(json => {
      setStats(json);
      setLoading(false);
    });
  }, []);

  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
        transition={{ repeat: Infinity, duration: 1.5 }} 
        className="text-blue-600 font-black text-2xl tracking-tighter"
      >
        CC
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] p-6 pb-40">
      <header className="pt-10 mb-10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-1">Analytics</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Spending Split</h1>
      </header>

      {stats.length > 0 ? (
        <>
          {/* 1. Bento Summary Grid */}
          <section className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3"><Target size={20} /></div>
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Top Item</p>
              <p className="text-sm font-bold truncate w-full text-center">{stats[0]?._id || "..."}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-[2.5rem] flex flex-col items-center">
              <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center mb-3"><TrendingDown size={20} /></div>
              <p className="text-[9px] font-black text-white/40 uppercase mb-1">Total Out</p>
              <p className="text-sm font-bold text-white">₹{stats.reduce((a, b) => a + b.total, 0).toLocaleString('en-IN')}</p>
            </div>
          </section>

          {/* 2. Main Chart Card */}
          <section className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-xl mb-8">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePie data={stats} innerRadius={65} outerRadius={90} paddingAngle={10} dataKey="total">
                  {stats.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} cornerRadius={12} stroke="none" />)}
                </RePie>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 3. Category List */}
          <div className="space-y-4">
            {stats.map((item, i) => (
              <div key={item._id} className="bg-white p-5 rounded-[1.8rem] border border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: COLORS[i % COLORS.length], boxShadow: `0 0 10px ${COLORS[i % COLORS.length]}80` }} />
                  <p className="font-bold text-slate-800 text-sm">{item._id}</p>
                </div>
                <p className="font-black text-slate-900 text-sm">{formatCurrency(item.total)}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* --- PREMIUM EMPTY STATE --- */
        <section className="flex flex-col items-center justify-center py-10 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white rounded-[3.5rem] p-12 border border-slate-50 shadow-2xl shadow-blue-100/20 text-center relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 relative">
                <BarChart3 size={40} className="text-blue-600" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-2 -right-2 bg-blue-600 p-1.5 rounded-xl shadow-lg"
                >
                  <Sparkles size={14} className="text-white" />
                </motion.div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">No Data Found</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 px-4">
                We need at least one transaction to generate your financial breakdown.
              </p>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/dashboard")}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-xl active:bg-blue-600 transition-colors"
              >
                <Plus size={18} strokeWidth={3} />
                <span className="text-xs font-black uppercase tracking-widest">Add First Entry</span>
              </motion.button>
            </div>
          </motion.div>
        </section>
      )}

      {/* --- NAVIGATION --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-50 px-8 py-4 pb-10 z-[90] flex justify-between items-center">
        <button onClick={() => router.push("/dashboard")} className="flex flex-col items-center gap-1 text-slate-300">
          <Home size={24} /><span className="text-[9px] font-black uppercase tracking-tight">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-blue-600">
          <PieChart size={24} strokeWidth={2.5} /><span className="text-[9px] font-black uppercase tracking-tight">Insights</span>
        </button>
        <button onClick={() => router.push("/history")} className="flex flex-col items-center gap-1 text-slate-300">
          <History size={24} /><span className="text-[9px] font-black uppercase tracking-tight">History</span>
        </button>
        <button onClick={() => router.push("/settings")} className="flex flex-col items-center gap-1 text-slate-300">
          <Settings size={24} /><span className="text-[9px] font-black uppercase tracking-tight">More</span>
        </button>
      </nav>
    </div>
  );
}