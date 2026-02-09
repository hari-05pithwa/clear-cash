"use client";
import { Home, PieChart, History, Settings } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: "/dashboard", label: "Vault", icon: Home },
    { id: "/insights", label: "Insights", icon: PieChart },
    { id: "/history", label: "Archive", icon: History },
    { id: "/settings", label: "Vault ID", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100/50 px-8 py-4 pb-10 z-[100] flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
      {tabs.map((tab) => {
        const isActive = pathname === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => router.push(tab.id)}
            className="relative flex flex-col items-center justify-center py-2 px-4 group outline-none"
          >
            {/* Immediate Haptic-style scale effect on tap */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-1.5 z-10 transition-colors duration-500 ${
                isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
              }`}
            >
              <tab.icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {tab.label}
              </span>
            </motion.div>

            {/* Shared Layout Animation - This "slides" the active state between tabs */}
            <AnimatePresence>
              {isActive && (
                <>
                  {/* The Sliding Pill Background */}
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-blue-50/60 rounded-2xl -z-0"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30
                    }}
                  />
                  {/* The Sliding Top Indicator */}
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -top-1 w-1.5 h-1.5 bg-blue-600 rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 28
                    }}
                  />
                </>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </nav>
  );
}