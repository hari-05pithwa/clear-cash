// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Wallet, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Heart } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Onboarding() {
//   const [inputValue, setInputValue] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const router = useRouter();

//   const formatIndianCurrency = (val) => {
//     if (!val) return "";
//     const x = val.replace(/\D/g, "");
//     let lastThree = x.substring(x.length - 3);
//     const otherNumbers = x.substring(0, x.length - 3);
//     if (otherNumbers !== "") lastThree = "," + lastThree;
//     return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
//   };

//   const handleChange = (e) => {
//     const rawValue = e.target.value.replace(/\D/g, "");
//     if (rawValue.length <= 10) setInputValue(formatIndianCurrency(rawValue));
//   };

//   const handleStart = async (e) => {
//     e.preventDefault();
//     const numericValue = parseFloat(inputValue.replace(/,/g, ""));
//     if (!numericValue || isNaN(numericValue)) return;
    
//     setLoading(true);

//     try {
//       const res = await fetch("/api/auth/setup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ initialBalance: numericValue }),
//       });

//       if (res.ok) {
//         setIsSuccess(true);
//         setTimeout(() => router.push("/dashboard"), 1200);
//       } else {
//         setLoading(false);
//       }
//     } catch (error) {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-[100dvh] bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden flex flex-col">
//       {/* Soft Ambient Background Glows */}
//       <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[50%] bg-blue-100/50 blur-[120px] rounded-full" />
//       <div className="absolute bottom-[-5%] right-[-5%] w-[60%] h-[40%] bg-indigo-50 blur-[100px] rounded-full" />

//       {/* Header Section */}
//       <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8 p-5 bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-white"
//         >
//           <Wallet size={48} className="text-blue-600" />
//         </motion.div>
        
//         <motion.h1 
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="text-4xl font-black tracking-tight text-slate-900 mb-3"
//         >
//           ClearCash
//         </motion.h1>
        
//         <motion.p 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.1 }}
//           className="text-slate-500 font-medium text-center max-w-[240px]"
//         >
//           Take control of your daily spends and receives.
//         </motion.p>
//       </div>

//       {/* Interaction Card */}
//       <motion.div 
//         initial={{ y: 100 }}
//         animate={{ y: 0 }}
//         transition={{ type: "spring", damping: 25, stiffness: 200 }}
//         className="relative z-10 bg-white/80 backdrop-blur-2xl border-t border-white rounded-t-[3.5rem] px-8 pt-12 pb-10 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.05)]"
//       >
//         <form onSubmit={handleStart} className="max-w-md mx-auto space-y-10">
//           <div className="space-y-6 text-center">
//             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
//               Current Bank Balance
//             </p>
            
//             <div className="relative">
//               <input
//                 type="text"
//                 inputMode="numeric"
//                 autoFocus
//                 placeholder="₹0"
//                 className="w-full bg-transparent text-6xl text-center font-black outline-none text-slate-900 placeholder:text-slate-200 transition-all"
//                 value={inputValue ? `₹${inputValue}` : ""}
//                 onChange={handleChange}
//               />
//               <motion.div 
//                 animate={{ width: inputValue ? "100%" : "40%" }}
//                 className="h-1.5 bg-blue-600/10 rounded-full mx-auto mt-4 overflow-hidden"
//               >
//                 <motion.div 
//                    initial={{ x: "-100%" }}
//                    animate={{ x: "0%" }}
//                    className="h-full bg-blue-600" 
//                 />
//               </motion.div>
//             </div>
//           </div>

//           <motion.button
//             whileTap={{ scale: 0.96 }}
//             disabled={loading || !inputValue}
//             className="relative w-full h-20 bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 transition-all disabled:opacity-30 disabled:shadow-none"
//           >
//             <div className="relative flex items-center justify-center gap-3 text-white text-lg font-bold">
//               {loading ? (
//                 <div className="flex items-center gap-3">
//                   <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
//                   <span>Setting up...</span>
//                 </div>
//               ) : (
//                 <>
//                   <span>Confirm</span>
//                   <ArrowRight size={20} />
//                 </>
//               )}
//             </div>
//           </motion.button>

//           <div className="flex items-center justify-center gap-2 text-slate-400">
//             <Heart size={14} className="fill-slate-100" />
//             <span className="text-[10px] font-medium uppercase tracking-widest">
//               Built for your financial peace
//             </span>
//           </div>
//         </form>
//       </motion.div>

//       {/* Success/Transition Overlay */}
//       <AnimatePresence>
//         {isSuccess && (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
//           >
//             <motion.div 
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               className="flex flex-col items-center gap-6"
//             >
//               <div className="w-24 h-24 bg-blue-600 rounded-[3rem] flex items-center justify-center shadow-2xl shadow-blue-200">
//                 <CheckCircle2 size={48} className="text-white" />
//               </div>
//               <div className="text-center px-8">
//                 <h2 className="text-2xl font-black text-slate-900">All Set!</h2>
//                 <p className="text-slate-400 font-medium mt-1">Ready to manage your finances.</p>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Heart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Onboarding() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const formatIndianCurrency = (val) => {
    if (!val) return "";
    const x = val.replace(/\D/g, "");
    let lastThree = x.substring(x.length - 3);
    const otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== "") lastThree = "," + lastThree;
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  };

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length <= 10) setInputValue(formatIndianCurrency(rawValue));
  };

  const handleStart = async (e) => {
    e.preventDefault();
    const numericValue = parseFloat(inputValue.replace(/,/g, ""));
    if (!numericValue || isNaN(numericValue)) return;
    
    setLoading(true);

    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initialBalance: numericValue }),
      });

      if (res.ok) {
        setIsSuccess(true);
        // Modern UX: Artificial delay so the user feels the "Success" state
        setTimeout(() => router.push("/dashboard"), 1800);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden flex flex-col">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[50%] bg-blue-100/50 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[60%] h-[40%] bg-indigo-50 blur-[100px] rounded-full" />

      {/* Header Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-white"
        >
          <Wallet size={48} className="text-blue-600" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl font-black tracking-tight text-slate-900 mb-3"
        >
          ClearCash
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 font-medium text-center max-w-[240px]"
        >
          Take control of your IPOs, lending, and daily spends.
        </motion.p>
      </div>

      {/* Interaction Card */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative z-10 bg-white/80 backdrop-blur-2xl border-t border-white rounded-t-[3.5rem] px-8 pt-12 pb-10 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.05)]"
      >
        <form onSubmit={handleStart} className="max-w-md mx-auto space-y-10">
          <div className="space-y-6 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Current Bank Balance
            </p>
            
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                placeholder="₹0"
                className="w-full bg-transparent text-6xl text-center font-black outline-none text-slate-900 placeholder:text-slate-200 transition-all"
                value={inputValue ? `₹${inputValue}` : ""}
                onChange={handleChange}
              />
              <motion.div 
                animate={{ width: inputValue ? "100%" : "40%" }}
                className="h-1.5 bg-blue-600/10 rounded-full mx-auto mt-4 overflow-hidden"
              >
                <motion.div 
                   initial={{ x: "-100%" }}
                   animate={{ x: "0%" }}
                   className="h-full bg-blue-600" 
                />
              </motion.div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            disabled={loading || !inputValue}
            className="relative w-full h-20 bg-slate-900 text-white rounded-[2rem] overflow-hidden shadow-2xl transition-all disabled:opacity-30"
          >
            <div className="relative flex items-center justify-center gap-3 text-lg font-bold">
              {loading ? "Encrypting..." : "Initialize Wallet"}
              {!loading && <ArrowRight size={20} />}
            </div>
          </motion.button>

          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Heart size={14} className="fill-slate-100" />
            <span className="text-[10px] font-medium uppercase tracking-widest">
              Financial Peace of Mind
            </span>
          </div>
        </form>
      </motion.div>

      {/* Modern Transition Overlay */}
      <AnimatePresence>
        {(loading || isSuccess) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white/60 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8"
          >
            <div className="max-w-xs w-full">
              {!isSuccess ? (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-6">
                    <Loader2 size={64} className="text-blue-600 animate-spin" strokeWidth={1.5} />
                    <div className="absolute inset-0 bg-blue-600/10 blur-xl rounded-full animate-pulse" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Syncing Atlas</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">Establishing secure cloud ledger...</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <motion.div 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    className="w-20 h-20 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200 mb-6"
                  >
                    <CheckCircle2 size={40} className="text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Success</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">Directing to your dashboard</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}