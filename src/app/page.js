"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // High-speed local check for device identity
    const checkIdentity = () => {
      const isSetup = localStorage.getItem("cc_setup_complete");
      const userId = localStorage.getItem("cc_user_id");

      // Small artificial delay to let the animation breathe
      setTimeout(() => {
        if (isSetup && userId) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      }, 1500);
    };

    checkIdentity();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#FDFDFF]">
      {/* Premium Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100/50 blur-[100px] rounded-full" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Brand Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="w-20 h-20 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-slate-200 mb-8"
        >
          <span className="text-white text-2xl font-black tracking-tighter">CC</span>
        </motion.div>

        {/* Shimmer Text Logo */}
        <div className="text-center overflow-hidden">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-black tracking-tighter text-slate-900 uppercase"
          >
            ClearCash
          </motion.h1>
          
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-600 to-transparent mt-1"
          />
        </div>

        {/* Modern Status Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full shadow-sm"
        >
          <ShieldCheck size={14} className="text-blue-600" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Secure Entry
          </span>
        </motion.div>
      </div>

      {/* Bottom Legal/Version Micro-text */}
      <div className="absolute bottom-10">
        <p className="text-[9px] font-bold text-slate-200 uppercase tracking-widest">
          	&#169; Clear Cash
        </p>
      </div>
    </div>
  );
}