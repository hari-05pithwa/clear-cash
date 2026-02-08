// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Home, PieChart, History, Settings } from "lucide-react";
// import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";

// export default function DashboardLayout({ children }) {
//   const pathname = usePathname();

//   const navItems = [
//     { label: "Home", icon: Home, href: "/dashboard" },
//     { label: "Insights", icon: PieChart, href: "/insights" },
//     { label: "History", icon: History, href: "/history" },
//     { label: "More", icon: Settings, href: "/settings" },
//   ];

//   return (
//     <div className="flex flex-col min-h-[100dvh] bg-slate-50 font-sans">
//       {/* Main Content Area */}
//       <main className="flex-1 pb-24 overflow-y-auto">
//         {children}
//       </main>

//       {/* Bottom Navigation Bar (GPay Style) */}
//       <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-3 pb-8 z-50">
//         <div className="max-w-md mx-auto flex justify-between items-center">
//           {navItems.map((item) => {
//             const isActive = pathname === item.href;
//             const Icon = item.icon;

//             return (
//               <Link key={item.href} href={item.href} className="relative group">
//                 <div className="flex flex-col items-center gap-1">
//                   <motion.div
//                     whileTap={{ scale: 0.8 }}
//                     className={cn(
//                       "p-2 rounded-2xl transition-all duration-300",
//                       isActive 
//                         ? "bg-blue-50 text-bank-blue" 
//                         : "text-slate-400 group-hover:text-slate-600"
//                     )}
//                   >
//                     <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
//                   </motion.div>
//                   <span className={cn(
//                     "text-[10px] font-bold tracking-tight transition-colors",
//                     isActive ? "text-bank-blue" : "text-slate-400"
//                   )}>
//                     {item.label}
//                   </span>
                  
//                   {/* Active Indicator Dot */}
//                   {isActive && (
//                     <motion.div 
//                       layoutId="nav-dot"
//                       className="absolute -top-1 w-1 h-1 bg-bank-blue rounded-full"
//                     />
//                   )}
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </nav>
//     </div>
//   );
// }
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/shared/BottomNav";
import PageTransition from "@/components/PageTransition";

export default function DashboardLayout({ children }) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const handleNav = (href) => {
    setIsRedirecting(true);
    // 800ms gives the "CC Shimmer" enough time to feel intentional
    setTimeout(() => {
      router.push(href);
      // Brief delay to ensure the overlay clears once the new page mounts
      setTimeout(() => setIsRedirecting(false), 500);
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-[#FDFDFF]">
      {/* Global CC Shimmer Transition */}
      <PageTransition isExiting={isRedirecting} />
      
      {/* The Page Content */}
      <main className="pb-32">{children}</main>
      
      {/* Persistent Bottom Navigation */}
      <BottomNav onNavigate={handleNav} />
    </div>
  );
}