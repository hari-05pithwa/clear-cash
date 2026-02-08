"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Zap, ChevronRight, Fingerprint, Lock, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RecoveryPage() {
  const [vaultId, setVaultId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRecovery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/transactions?userId=${vaultId.trim()}`);
      const data = await res.json();

      if (res.ok && data.length > 0) {
        localStorage.setItem("cc_user_id", vaultId.trim());
        localStorage.setItem("cc_first_name", "Recovered");
        localStorage.setItem("cc_last_name", "Vault");
        router.push("/dashboard");
      } else {
        setError("Invalid Vault ID");
      }
    } catch (err) {
      setError("Synchronisation Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans overflow-hidden flex flex-col justify-center relative">
      {/* Dynamic Ambient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[50%] bg-blue-50/50 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-slate-100 blur-[100px] rounded-full" />

      {/* Header Navigation */}
      <motion.button 
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push("/onboarding")}
        className="absolute top-12 left-8 w-12 h-12 bg-white/80 backdrop-blur-md shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center z-50 active:scale-90 transition-transform"
      >
        <ArrowLeft size={20} className="text-slate-600" />
      </motion.button>

      <div className="max-w-sm mx-auto w-full px-8 relative z-10">
        <header className="text-center mb-12">
          {/* Animated Security Icon */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-slate-900 rounded-[2.8rem] flex items-center justify-center mx-auto shadow-2xl shadow-slate-200 mb-8 relative"
          >
            <Fingerprint size={44} className="text-blue-400" strokeWidth={1.5} />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-blue-400/20 rounded-[2.8rem]"
            />
          </motion.div>
          
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Sync Vault</h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed px-2">
            Input your Vault ID
          </p>
        </header>

        <form onSubmit={handleRecovery} className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center ml-4">
              <label className="text-[13px] font-black text-blue-600 uppercase tracking-[0.2em]">Signature Key</label>
              <Lock size={12} className="text-slate-300" />
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-600/5 blur-xl group-focus-within:bg-blue-600/10 transition-all opacity-0 group-focus-within:opacity-100" />
              <div className="bg-white border border-slate-100 rounded-[2.2rem] p-1.5 shadow-sm group-focus-within:border-blue-200 group-focus-within:shadow-xl group-focus-within:shadow-blue-600/5 transition-all relative z-10">
                <input 
                  type="text" 
                  required
                  placeholder="vlt_xxxxxxxxxxxx"
                  className="w-full bg-transparent py-5 px-6 font-mono text-xs uppercase outline-none text-slate-900 placeholder:text-slate-400 tracking-widest"
                  value={vaultId}
                  onChange={(e) => setVaultId(e.target.value)}
                />
              </div>
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] font-bold text-red-500 ml-5 uppercase tracking-tight flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading || vaultId.length < 5}
            className="w-full bg-slate-900 text-white h-20 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-slate-200 disabled:opacity-20 flex items-center justify-center gap-3 transition-all relative overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span className="animate-pulse">Establishing Link...</span>
              </div>
            ) : (
              <>
                <span>Establish Link</span>
                <ChevronRight size={18} strokeWidth={3} className="text-blue-400" />
              </>
            )}
          </motion.button>
        </form>

        <footer className="mt-16 flex flex-col items-center gap-6">
          <div className="h-[1px] w-12 bg-slate-100" />
          <div className="flex items-center gap-6 opacity-40 grayscale">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Clear Cash</span>
            </div>
            
          </div>
        </footer>
      </div>
    </div>
  );
}