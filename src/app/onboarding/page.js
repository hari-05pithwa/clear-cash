"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
  CheckCircle2,
  ArrowRight,
  User,
  Loader2,
  ChevronLeft,
  ShieldCheck,
  Fingerprint,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const formatIndianCurrency = (val) => {
    if (!val) return "";
    let x = val.replace(/\D/g, "");
    let lastThree = x.substring(x.length - 3);
    const otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== "") lastThree = "," + lastThree;
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  };

  const handleBalanceChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length <= 12) {
      setBalance(formatIndianCurrency(rawValue));
    }
  };

  const handleFinalize = async (e) => {
    e.preventDefault();
    const numericValue = parseFloat(balance.replace(/,/g, ""));
    if (!numericValue || isNaN(numericValue)) return;

    setLoading(true);
    const generatedUserId = `vault_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;

    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: generatedUserId,
          firstName,
          lastName,
          initialBalance: numericValue,
        }),
      });

      if (res.ok) {
        localStorage.setItem("cc_user_id", generatedUserId);
        localStorage.setItem("cc_first_name", firstName);
        localStorage.setItem("cc_last_name", lastName);
        localStorage.setItem("cc_setup_complete", "true");
        setIsSuccess(true);
        setTimeout(() => router.push("/dashboard"), 1800);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] bg-[#FDFDFF] text-slate-900 font-sans overflow-hidden flex flex-col">
      <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[50%] bg-blue-50 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[60%] h-[40%] bg-slate-100 blur-[100px] rounded-full" />

      <header className="relative z-10 px-8 pt-12 flex justify-between items-center">
        {step === 2 && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setStep(1)}
            className="w-12 h-12 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ChevronLeft size={20} />
          </motion.button>
        )}
        <div className="flex-1 text-right">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-sm">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
              Step 0{step}
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="id-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm text-center"
            >
              <div className="mb-10 inline-flex p-6 bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200">
                <Fingerprint
                  size={40}
                  strokeWidth={1.5}
                  className="text-white"
                />
              </div>

              <h1 className="text-4xl font-black tracking-tighter mb-3 text-slate-900 leading-tight">
                Identity.
              </h1>
              <p className="text-slate-400 font-medium text-sm mb-12 px-8 leading-relaxed">
                Personalize your private vault. Every entry is end-to-end
                encrypted.
              </p>

              <div className="space-y-4 mb-12">
                <div className="group relative bg-white border border-slate-100 rounded-[2.2rem] p-1.5 shadow-sm focus-within:shadow-xl focus-within:border-blue-200 transition-all duration-500">
                  <div className="flex items-center gap-4 px-6 py-5">
                    <User
                      size={18}
                      className="text-slate-300 group-focus-within:text-blue-600 transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full bg-transparent outline-none font-bold text-lg placeholder:text-slate-200"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="group relative bg-white border border-slate-100 rounded-[2.2rem] p-1.5 shadow-sm focus-within:shadow-xl focus-within:border-blue-200 transition-all duration-500">
                  <div className="flex items-center gap-4 px-6 py-5">
                    <div className="w-[18px]" />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full bg-transparent outline-none font-bold text-lg placeholder:text-slate-200"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  disabled={!firstName || !lastName}
                  onClick={() => setStep(2)}
                  className="w-full h-20 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.15em] text-[11px] shadow-2xl flex items-center justify-center gap-3 disabled:opacity-20 transition-all"
                >
                  Continue Setup <ArrowRight size={18} strokeWidth={3} />
                </motion.button>

                {/* THE RECOVERY LINK */}
                <button
                  onClick={() => router.push("/recovery")}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-1 active:text-blue-600 active:border-blue-600 transition-colors"
                >
                  Already have a Vault ID?
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="bal-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-sm text-center"
            >
              <div className="mb-10 inline-flex p-6 bg-white rounded-[2.5rem] shadow-xl shadow-blue-50 border border-slate-50 text-blue-600">
                <Wallet size={40} strokeWidth={1.5} />
              </div>

              <h1 className="text-4xl font-black tracking-tighter mb-3">
                Vault Value.
              </h1>
              <p className="text-slate-400 font-medium text-md mb-12">
                What is your current bank balance?
              </p>

              <div className="relative mb-16 px-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-black text-slate-600">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    placeholder="0"
                    style={{
                      fontSize: balance.length > 8 ? "2.5rem" : "4.2rem",
                    }}
                    className="w-full bg-transparent text-center font-black outline-none text-slate-900 placeholder:text-slate-100 transition-all duration-500"
                    value={balance}
                    onChange={handleBalanceChange}
                  />
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={loading || !balance}
                onClick={handleFinalize}
                className="w-full h-20 bg-blue-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.15em] text-[13px] shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-20 transition-all"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Authorize Vault"
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {(loading || isSuccess) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-8"
          >
            {!isSuccess ? (
              <div className="flex flex-col items-center">
                <Loader2
                  size={64}
                  className="text-blue-600 animate-spin mb-8"
                  strokeWidth={1.5}
                />
                <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900">
                  Securing Signature
                </h2>
                <p className="text-sm font-medium text-slate-400 mt-2 tracking-tight">
                  Generating unique Vault ID...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-emerald-500 rounded-[2.8rem] flex items-center justify-center shadow-2xl mb-8"
                >
                  <CheckCircle2
                    size={48}
                    className="text-white"
                    strokeWidth={2.5}
                  />
                </motion.div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
                  Success
                </h2>
                <p className="text-sm font-bold text-slate-400 mt-2 tracking-tight">
                  Vault Protocol Initialized
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
