"use client";
import { Home, PieChart, History, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function BottomNav({ onNavigate }) {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: PieChart, label: "Insights", href: "/insights" },
    { icon: History, label: "History", href: "/history" },
    { icon: Settings, label: "More", href: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-50 px-6 py-4 pb-8 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <button
              key={item.href}
              onClick={() => onNavigate(item.href)}
              className="relative flex flex-col items-center gap-1 group outline-none"
            >
              <motion.div
                whileTap={{ scale: 0.8 }}
                className={`p-2 rounded-2xl transition-colors ${
                  isActive ? "bg-blue-50 text-blue-600" : "text-slate-400"
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className={`text-[10px] font-bold tracking-tight ${
                isActive ? "text-blue-600" : "text-slate-400"
              }`}>
                {item.label}
              </span>
              
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -top-1 w-1 h-1 bg-blue-600 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}