"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Clock, Wallet, Check, ChevronRight, ArrowDownLeft, Sparkles, ShieldCheck } from "lucide-react";

const TYPES = [
  { id: "SPEND", label: "Spend", icon: Zap, color: "bg-slate-900" },
  { id: "IPO_HOLD", label: "IPO", icon: Clock, color: "bg-amber-500" },
  { id: "LENT", label: "Lent", icon: Wallet, color: "bg-blue-600" },
  { id: "RECEIVED", label: "Receive", icon: ArrowDownLeft, color: "bg-emerald-500" },
];

export default function AddTransactionModal({ isOpen, onClose, onRefresh }) {
  const [type, setType] = useState("SPEND");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, amount: parseFloat(amount), type, category }),
      });
      
      if (res.ok) {
        setIsSuccess(true); 
        // 2-second celebration before closing
        setTimeout(() => {
          onClose();
          onRefresh();
          setTimeout(() => {
            setIsSuccess(false);
            setAmount("");
            setName("");
          }, 300);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={!isSuccess ? onClose : null}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-[110]"
          />
          
          <motion.div 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3.5rem] z-[120] px-8 pt-4 pb-12 shadow-[0_-20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            {/* SUCCESS STATE UI: Morphing Card */}
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center"
                >
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.1 }}
                      className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200"
                    >
                      <motion.div
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                         <Check size={44} className="text-white" strokeWidth={4} />
                      </motion.div>
                    </motion.div>
                    
                    {/* Haptic Particles */}
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 bg-emerald-500/20 rounded-[2.5rem] -z-10"
                    />
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8"
                  >
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">SUCCESS</h2>
                    <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-widest">Transaction Vault Updated</p>
                  </motion.div>

                  {/* Summary Snippet */}
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-10 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3"
                  >
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span className="text-sm font-black text-slate-700">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
                    <div className="w-[1px] h-3 bg-slate-200" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight line-clamp-1">{name}</span>
                  </motion.div>
                </motion.div>
              ) : (
                /* FORM STATE UI */
                <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                  <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
                  
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Add Record</h2>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-400">
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Type Grid: Liquid Selector */}
                    <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2 rounded-[2.2rem]">
                      {TYPES.map((t) => (
                        <button
                          key={t.id} type="button" onClick={() => setType(t.id)}
                          className={`relative py-4 rounded-[1.5rem] flex flex-col items-center gap-2 transition-all ${
                            type === t.id ? "text-white" : "text-slate-400"
                          }`}
                        >
                          {type === t.id && (
                            <motion.div 
                              layoutId="activeType" 
                              className={`absolute inset-0 ${t.color} rounded-[1.4rem] shadow-xl`} 
                              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                            />
                          )}
                          <t.icon size={20} className="relative z-10" />
                          <span className="relative z-10 text-[9px] font-black uppercase tracking-tighter">{t.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Minimalist Numeric Entry */}
                    <div className="py-6 flex flex-col items-center">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Amount</p>
                       <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-slate-300">₹</span>
                          <input 
                            type="number" required placeholder="0" autoFocus
                            className="w-full max-w-[240px] text-7xl font-black text-center outline-none bg-transparent placeholder:text-slate-100 text-slate-900"
                            value={amount} onChange={(e) => setAmount(e.target.value)}
                          />
                       </div>
                    </div>

                    {/* Context Input: Bento Style */}
                    <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-2 focus-within:bg-white focus-within:border-blue-200 transition-all">
                      <div className="flex items-center gap-4 px-5 py-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400">
                          <Check size={20} />
                        </div>
                        <input 
                          type="text" required placeholder="Dinner, IPO application, etc..." 
                          className="flex-1 bg-transparent outline-none font-bold text-slate-900 placeholder:text-slate-200 text-lg"
                          value={name} onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button 
                      whileTap={{ scale: 0.97 }}
                      disabled={loading || !amount || !name}
                      className="w-full bg-slate-900 text-white h-20 rounded-[2.5rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl active:bg-blue-600 disabled:opacity-20 transition-all"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Confirm Entry</span>
                          <ChevronRight size={20} strokeWidth={3} />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}