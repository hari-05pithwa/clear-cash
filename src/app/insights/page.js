// ai2
"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PieChart as RePie, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Target,
  TrendingDown,
  Home,
  PieChart,
  History,
  Settings,
  BarChart3,
  ChevronDown,
  Zap,
  Filter,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const FILTER_CATEGORIES = ["All", "Food", "Petrol", "Shopping", "Other"];
const DATE_FILTERS = ["All Time", "This Week", "This Month"];
const COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[11px] font-black tracking-tighter"
    >
      {percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""}
    </text>
  );
};

export default function Insights() {
  const [rawStats, setRawStats] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("cc_user_id");
    if (!userId) {
      router.push("/onboarding");
      return;
    }
    const rangeParam = dateFilter.toLowerCase().replace(" ", "");
    fetch(`/api/insights?userId=${userId}&range=${rangeParam}`)
      .then((res) => res.json())
      .then((json) => {
        setRawStats(Array.isArray(json) ? json : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router, dateFilter]);

  const filteredStats = useMemo(() => {
    if (activeFilter === "All") return rawStats;
    return rawStats.filter(
      (item) => item._id?.toLowerCase() === activeFilter.toLowerCase(),
    );
  }, [rawStats, activeFilter]);

  const currentCategorySpend = useMemo(() => {
    return filteredStats.reduce((acc, curr) => acc + curr.total, 0);
  }, [filteredStats]);

  if (loading)
    return (
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
    <div className="min-h-screen bg-[#FDFDFF] p-6 pb-44 selection:bg-blue-100 overflow-x-hidden relative">
      {/* Tap-to-close Backdrop */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFilterOpen(false)}
            className="fixed inset-0 z-[95] bg-slate-900/5 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      <header className="pt-10 mb-8 relative z-[100]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">
              Vault Analytics
            </p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              Spending Split
            </h1>
          </div>

          {/* Category Filter Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-3 rounded-2xl shadow-sm transition-all ${isFilterOpen ? "bg-slate-900 text-white" : "bg-white text-slate-900 border border-slate-100"}`}
          >
            <Filter size={20} strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Time Filter Row: Restored to Horizontal Pills */}
        <section className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {DATE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                dateFilter === f
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                  : "bg-white text-slate-400 border-slate-100"
              }`}
            >
              {f}
            </button>
          ))}
        </section>

        {/* Category Dropdown Menu */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 p-2 z-[110]"
            >
              {FILTER_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveFilter(cat);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-colors ${activeFilter === cat ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:bg-slate-50"}`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence mode="wait">
        {activeFilter === "All" && rawStats.length === 0 ? (
          /* --- ALL VIEW EMPTY STATE --- */
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-24 bg-white rounded-[4rem] shadow-2xl border border-slate-50 flex flex-col items-center"
          >
            <BarChart3 size={48} className="text-blue-600 mb-6" />
            <h2 className="font-black text-2xl text-slate-900 uppercase tracking-tight">
              Vault Empty
            </h2>
            <p className="text-slate-400 text-sm mt-2 mb-10 px-10 text-center">
              No data found for{" "}
              <span className="text-blue-600 font-bold">{dateFilter}</span>.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest shadow-xl"
            >
              Go to Vault
            </button>
          </motion.div>
        ) : activeFilter === "All" ? (
          /* --- ALL VIEW PORTFOLIO --- */
          <motion.div
            key="all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <section className="bg-white rounded-[3.5rem] p-8 border border-slate-50 shadow-xl relative overflow-hidden">
              <div className="absolute top-8 right-8 z-20 bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-white flex flex-col gap-2">
                {rawStats.map((item, index) => (
                  <div key={item._id} className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shadow-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-[9px] font-black text-slate-600 uppercase truncate max-w-[65px]">
                      {item._id}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-[340px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RePie>
                    <Pie
                      data={rawStats}
                      innerRadius={90}
                      outerRadius={130}
                      paddingAngle={4}
                      dataKey="total"
                      nameKey="_id"
                      stroke="none"
                      label={renderCustomizedLabel}
                      labelLine={false}
                      isAnimationActive={false}
                    >
                      {rawStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          cornerRadius={16}
                        />
                      ))}
                    </Pie>
                  </RePie>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                    {dateFilter}
                  </p>
                  <p className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                    Portfolio
                  </p>
                </div>
              </div>
            </section>
            <div className="space-y-3">
              {rawStats.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white p-5 rounded-[2rem] border border-slate-50 flex justify-between items-center shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <p className="font-black text-slate-900 text-[13px] uppercase tracking-tight">
                      {item._id}
                    </p>
                  </div>
                  <p className="font-black text-slate-900 text-sm">
                    {formatCurrency(item.total)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* --- INDIVIDUAL CATEGORY VIEW: Shows ₹0 instead of Empty state --- */
          <motion.div
            key="cat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pt-4 flex flex-col items-center justify-center min-h-[50vh]"
          >
            <div className="w-full bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/10">
                  <Zap size={28} className="fill-blue-400 text-blue-400" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400/60 mb-3">
                  Total Spent
                </p>
                <h2 className="text-6xl font-black tracking-tighter mb-8 italic uppercase leading-none">
                  {activeFilter}
                </h2>
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-8 opacity-30" />
                <p className="text-5xl font-black tracking-tighter mb-2">
                  {formatCurrency(currentCategorySpend)}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 italic">
                  {dateFilter} Vault
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveFilter("All")}
              className="mt-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200 pb-1"
            >
              Portfolio Overview
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-50 px-10 py-5 pb-10 z-[90] flex justify-between items-center shadow-2xl">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex flex-col items-center gap-1.5 text-slate-400 outline-none"
        >
          <Home size={26} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-tighter">
            Vault
          </span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-blue-600 outline-none">
          <PieChart size={26} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-tighter">
            Insights
          </span>
        </button>
        <button
          onClick={() => router.push("/history")}
          className="flex flex-col items-center gap-1.5 text-slate-400 outline-none"
        >
          <History size={26} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-tighter">
            Archive
          </span>
        </button>
        <button
          onClick={() => router.push("/settings")}
          className="flex flex-col items-center gap-1.5 text-slate-400 outline-none"
        >
          <Settings size={26} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-tighter">
            Vault ID
          </span>
        </button>
      </nav>
    </div>
  );
}
