"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, User, Shield, Copy, Check, Trash2, 
  ChevronRight, LogOut, Home, PieChart, History, Settings as SettingsIcon 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userId, setUserId] = useState("");
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setFirstName(localStorage.getItem("cc_first_name") || "");
    setLastName(localStorage.getItem("cc_last_name") || "");
    setUserId(localStorage.getItem("cc_user_id") || "");
  }, []);

  const handleUpdateName = () => {
    localStorage.setItem("cc_first_name", firstName);
    localStorage.setItem("cc_last_name", lastName);
    // Visual feedback could be added here
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetVault = () => {
    localStorage.clear();
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 pb-40">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-white/80 backdrop-blur-xl z-30 border-b border-slate-50">
        <div className="flex justify-between items-center">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => router.push("/dashboard")} className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center">
            <ArrowLeft size={22} />
          </motion.button>
          <h1 className="text-xl font-black uppercase tracking-tight">Vault ID</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* 1. Profile Section */}
        <section className="space-y-4">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-2">Identity</p>
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-300 uppercase ml-1">First Name</label>
              <input 
                type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} onBlur={handleUpdateName}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 font-bold text-slate-900 outline-none focus:ring-2 ring-blue-100 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-300 uppercase ml-1">Last Name</label>
              <input 
                type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} onBlur={handleUpdateName}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 font-bold text-slate-900 outline-none focus:ring-2 ring-blue-100 transition-all"
              />
            </div>
          </div>
        </section>

        {/* 2. Vault ID Section */}
        <section className="space-y-4">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-2">Device Signature</p>
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Shield size={18} className="text-blue-400" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Unique Key</p>
                <p className="text-xs font-bold text-blue-100">Encrypted Local Hash</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5 flex items-center justify-between gap-4">
              <code className="text-[10px] font-mono text-blue-200/70 truncate uppercase tracking-tighter">{userId}</code>
              <button onClick={copyToClipboard} className="text-blue-400 active:scale-90 transition-transform">
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <p className="text-[9px] leading-relaxed text-white/30 font-medium italic">Save this ID. If you clear your browser data or switch devices, you will need this key to reconnect to your existing ledger.</p>
          </div>
        </section>

        {/* 3. Danger Zone */}
        <section className="space-y-4">
          <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] ml-2">Danger Zone</p>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full bg-red-50 text-red-500 py-6 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 active:bg-red-100 transition-all"
          >
            <Trash2 size={16} />
            Reset Local Vault
          </button>
        </section>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]" />
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-10 left-6 right-6 bg-white rounded-[3rem] p-10 z-[110] text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><Trash2 size={32} /></div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Reset Everything?</h3>
              <p className="text-slate-400 text-sm mb-8">This will log you out and clear your local identity. Your data in the cloud will remain, but you'll need your Vault ID to get back in.</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleResetVault} className="w-full bg-red-500 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-lg shadow-red-200">Yes, Reset Vault</button>
                <button onClick={() => setShowDeleteConfirm(false)} className="w-full bg-slate-50 text-slate-400 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest">Cancel</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-50 px-10 py-5 pb-10 z-[90] flex justify-between items-center shadow-2xl">
        <button onClick={() => router.push("/dashboard")} className="flex flex-col items-center gap-1.5 text-slate-400 outline-none"><Home size={26} strokeWidth={2.5} /><span className="text-[9px] font-black uppercase tracking-tighter">Vault</span></button>
        <button onClick={() => router.push("/insights")} className="flex flex-col items-center gap-1.5 text-slate-400 outline-none"><PieChart size={26} strokeWidth={2.5} /><span className="text-[9px] font-black uppercase tracking-tighter">Insights</span></button>
        <button onClick={() => router.push("/history")} className="flex flex-col items-center gap-1.5 text-slate-400 outline-none"><History size={26} strokeWidth={2.5} /><span className="text-[9px] font-black uppercase tracking-tighter">Archive</span></button>
        <button className="flex flex-col items-center gap-1.5 text-blue-600 outline-none"><SettingsIcon size={26} strokeWidth={2.5} /><span className="text-[9px] font-black uppercase tracking-tighter">Vault ID</span></button>
      </nav>
    </div>
  );
}