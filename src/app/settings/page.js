"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Check,
  LogOut,
  User,
  Fingerprint,
  ChevronRight,
  ShieldCheck,
  Lock,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function SettingsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [originalName, setOriginalName] = useState({ first: "", last: "" });
  const [userId, setUserId] = useState("");
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fName = localStorage.getItem("cc_first_name") || "";
    const lName = localStorage.getItem("cc_last_name") || "";
    const rawId = localStorage.getItem("cc_user_id") || "";

    setFirstName(fName);
    setLastName(lName);
    setOriginalName({ first: fName, last: lName });
    setUserId(rawId.replace("vault_", ""));
  }, []);

  const hasChanges =
    (firstName !== originalName.first || lastName !== originalName.last) &&
    !isUpdating;

  const handleNameChange = (e, setter) => {
    const value = e.target.value;
    const lettersOnly = value.replace(/[^a-zA-Z]/g, "");
    setter(lettersOnly);
  };

  const handleUpdateName = () => {
    setIsUpdating(true);
    localStorage.setItem("cc_first_name", firstName);
    localStorage.setItem("cc_last_name", lastName);
    setOriginalName({ first: firstName, last: lastName });

    setTimeout(() => {
      setIsUpdating(false);
      toast.success("Profile Updated Successfully", {
        duration: 1500,
      });
    }, 1000);
  };

  const displayId = userId ? userId.slice(0, 6).toUpperCase() : "------";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    // Using success here to trigger the green alert
    toast.success("Copied Successfully", {
      duration: 1500,
    });
    setTimeout(() => setCopied(false), 1500);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900">
      <header className="px-6 pt-14 pb-6 sticky top-0 bg-[#FDFDFF]/80 backdrop-blur-2xl z-40">
        <div className="flex justify-between items-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push("/dashboard")}
            className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400"
          >
            <ArrowLeft size={22} />
          </motion.button>
          <div className="text-center">
            <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-1">
              Identity
            </h1>
            <p className="text-lg font-black text-slate-900 uppercase italic">
              Security Hub
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <ShieldCheck size={22} strokeWidth={2.5} />
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8 pb-40">
        <motion.section
          layout
          className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
              <User size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Profile Details
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-300 uppercase ml-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => handleNameChange(e, setFirstName)}
                  placeholder="Letters only"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 font-bold text-slate-900 outline-none text-sm focus:ring-2 ring-blue-100 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-300 uppercase ml-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => handleNameChange(e, setLastName)}
                  placeholder="Letters only"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 font-bold text-slate-900 outline-none text-sm focus:ring-2 ring-blue-100 transition-all"
                />
              </div>
            </div>

            <AnimatePresence>
              {hasChanges && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdateName}
                  disabled={isUpdating}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all"
                >
                  <RefreshCw
                    size={14}
                    className={isUpdating ? "animate-spin" : ""}
                  />
                  {isUpdating ? "Syncing..." : "Update Identity"}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        <section className="space-y-4">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <motion.div
              animate={{ top: ["-10%", "110%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute left-0 right-0 h-[1px] bg-blue-500/20 z-0"
            />

            <div className="relative z-10 text-center">
              <Fingerprint
                size={32}
                className="text-blue-500 mx-auto mb-6 opacity-80"
              />
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">
                Master Access Key
              </p>

              <div className="flex items-center justify-center gap-6 mb-8">
                <h3 className="text-4xl font-black tracking-[0.25em] text-blue-100 italic">
                  {displayId}
                </h3>
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={copyToClipboard}
                  className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </motion.button>
              </div>

              <p className="text-[8px] leading-relaxed text-white/20 font-medium px-4">
                Use this unique 6-digit key to re-authorize your session on new
                devices.
              </p>
            </div>
          </div>
        </section>

        <section>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full bg-white border-2 border-red-50 flex items-center justify-between p-6 rounded-[2rem] group active:bg-red-50 transition-all shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                <LogOut size={20} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-red-500">
                Secure Logout
              </span>
            </div>
            <ChevronRight size={18} className="text-red-200" />
          </button>
        </section>
      </main>

      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              className="fixed bottom-10 left-6 right-6 bg-white rounded-[3rem] p-10 z-[110] text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Lock size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
                Logout?
              </h3>
              <p className="text-slate-400 text-sm mb-8 px-4 leading-relaxed">
                Your session will end. Ensure you have your Access Key saved.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLogout}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest"
                >
                  Terminate Session
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full bg-slate-50 text-slate-400 py-5 rounded-2xl font-black uppercase text-xs tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
