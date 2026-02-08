"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatDate, formatCurrency } from "@/lib/utils";
import { 
  ArrowLeft, Search, Filter, Zap, Clock, Wallet, 
  Home, PieChart, History, Settings, CalendarDays, Plus 
} from "lucide-react";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/transactions").then(res => res.json()).then(json => {
      setTransactions(json);
      setLoading(false);
    });
  }, []);

  // Logic to group transactions by date for better scannability
  const groupedTransactions = useMemo(() => {
    const groups = {};
    transactions.forEach((tx) => {
      const date = new Date(tx.timestamp).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(tx);
    });
    return groups;
  }, [transactions]);

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
    <div className="min-h-screen bg-[#FDFDFF] font-sans text-slate-900 selection:bg-blue-100 pb-40">
      {/* 1. Ultra-Modern Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-slate-100/50 px-6 pt-12 pb-6">
        <div className="flex justify-between items-center mb-8">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push("/dashboard")} 
            className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-[1.25rem] flex items-center justify-center transition-all hover:bg-slate-50"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Transaction Vault</h1>
            
          </div>

          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-[1.25rem] flex items-center justify-center"
          >
            <Filter size={20} className="text-slate-400" />
          </motion.button>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="w-full bg-slate-100/50 border-transparent rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-400" 
          />
        </div>
      </header>

      {transactions.length > 0 ? (
        <section className="px-6 py-8">
          {Object.entries(groupedTransactions).map(([date, items], groupIdx) => (
            <div key={date} className="mb-10">
              {/* Date Header: Grouped Logic */}
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{date}</h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-100 to-transparent" />
              </div>

              <div className="space-y-4">
                {items.map((tx, i) => (
                  <motion.div 
                    key={tx._id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-100/50 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-[1.5rem] shadow-sm flex items-center justify-center transition-transform group-hover:scale-110 ${
                          tx.type === 'SPEND' ? 'bg-slate-900 text-white' : 
                          tx.type === 'IPO_HOLD' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                        }`}>
                          {tx.type === 'SPEND' ? <Zap size={22} fill="currentColor" /> : 
                           tx.type === 'IPO_HOLD' ? <Clock size={22} /> : <Wallet size={22} />}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[15px] text-slate-900 tracking-tight leading-tight">{tx.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{tx.category}</span>
                            <div className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`text-base font-black tracking-tight ${
                          tx.type === 'RECEIVED' || tx.type === 'INITIAL' ? 'text-emerald-500' : 'text-slate-900'
                        }`}>
                          {tx.type === 'RECEIVED' || tx.type === 'INITIAL' ? '+' : '−'}{formatCurrency(tx.amount).replace('₹', '')}
                        </p>
                        <p className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest mt-0.5">INR</p>
                      </div>
                    </div>

                    {tx.note && (
                      <div className="mt-4 pt-4 border-t border-slate-50">
                        <p className="text-[11px] font-semibold text-slate-500 leading-relaxed italic bg-slate-50/80 p-3 rounded-2xl">
                          "{tx.note}"
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : (
        /* Empty State logic */
        <section className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 text-slate-300">
            <CalendarDays size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Archive is Empty</h2>
          <p className="text-slate-500 text-sm mt-2 max-w-[240px] font-medium leading-relaxed">
            Every transaction you log will appear here as a chronological timeline.
          </p>
        </section>
      )}

      {/* --- NAVIGATION --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-8 py-4 pb-10 z-[90] flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <button onClick={() => router.push("/dashboard")} className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors">
          <Home size={24} strokeWidth={2} /><span className="text-[10px] font-bold uppercase tracking-tight">Home</span>
        </button>
        <button onClick={() => router.push("/insights")} className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors">
          <PieChart size={24} strokeWidth={2} /><span className="text-[10px] font-bold uppercase tracking-tight">Insights</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-blue-600">
          <History size={24} strokeWidth={2.5} /><span className="text-[10px] font-bold uppercase tracking-tight">History</span>
        </button>
        <button onClick={() => router.push("/settings")} className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors">
          <Settings size={24} strokeWidth={2} /><span className="text-[10px] font-bold uppercase tracking-tight">More</span>
        </button>
      </nav>
    </div>
  );
}