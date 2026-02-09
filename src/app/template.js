// "use client";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { usePathname } from "next/navigation";
// import { Plus } from "lucide-react";
// import BottomNav from "@/components/shared/BottomNav";
// import AddTransactionModal from "@/components/dashboard/AddTransactionModal";

// export default function Template({ children }) {
//   const pathname = usePathname();
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // --- UPDATED LOGIC ---
//   // Now only returns true if the current path is exactly "/dashboard"
//   const showFab = pathname === "/dashboard";

//   return (
//     <div className="relative h-screen overflow-hidden bg-[#FDFDFF]">
//       {/* 1. SCROLLABLE CONTENT AREA */}
//       <AnimatePresence mode="wait">
//         <motion.main
//           key={pathname}
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -10 }}
//           transition={{ duration: 0.3, ease: "easeInOut" }}
//           className="h-full overflow-y-auto"
//         >
//           <div className="pb-60">
//             {children}
//           </div>
//         </motion.main>
//       </AnimatePresence>

//       {/* 2. FIXED UI LAYER (FAB) */}
//       <AnimatePresence>
//         {showFab && (
//           <div className="fixed bottom-32 left-0 right-0 flex justify-center z-[120] pointer-events-none px-6">
//             <motion.button
//               initial={{ scale: 0, opacity: 0, y: 20 }} // Added slight y-offset for better entry
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0, opacity: 0, y: 20 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setIsModalOpen(true)}
//               className="pointer-events-auto w-full max-w-[200px] bg-slate-900 text-white py-5 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 border border-white/10"
//             >
//               <Plus size={22} strokeWidth={4} />
//               <span className="text-[11px] font-black uppercase tracking-[0.15em]">New Entry</span>
//             </motion.button>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* Persistent Bottom Nav */}
//       <BottomNav />

//       {/* Global Modal instance */}
//       <AddTransactionModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         onRefresh={() => window.location.reload()} 
//       />
//     </div>
//   );
// }



"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import BottomNav from "@/components/shared/BottomNav";
import AddTransactionModal from "@/components/dashboard/AddTransactionModal";

export default function Template({ children }) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Define the pages where the BottomNav and Modal should exist
  const authenticatedPaths = ["/dashboard", "/history", "/insights", "/settings"];
  const isAppPage = authenticatedPaths.includes(pathname);

  // 2. Define exactly where the "New Entry" button appears
  const showFab = pathname === "/dashboard";

  return (
    <div className="relative h-screen overflow-hidden bg-[#FDFDFF]">
      {/* SCROLLABLE CONTENT AREA */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full overflow-y-auto"
        >
          {/* Conditional padding: Only add bottom padding if the Nav is present */}
          <div className={isAppPage ? "pb-40" : ""}>
            {children}
          </div>
        </motion.main>
      </AnimatePresence>

      {/* RENDER ONLY ON APP PAGES */}
      {isAppPage && (
        <>
          {/* 1. FIXED UI LAYER (FAB) */}
          <AnimatePresence>
            {showFab && (
              <div className="fixed bottom-32 left-0 right-0 flex justify-center z-[120] pointer-events-none px-6">
                <motion.button
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0, y: 20 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="pointer-events-auto w-full max-w-[200px] bg-slate-900 text-white py-5 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 border border-white/10"
                >
                  <Plus size={22} strokeWidth={4} />
                  <span className="text-[11px] font-black uppercase tracking-[0.15em]">New Entry</span>
                </motion.button>
              </div>
            )}
          </AnimatePresence>

          {/* 2. Persistent Bottom Nav */}
          <BottomNav />

          {/* 3. Global Modal Instance */}
          <AddTransactionModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onRefresh={() => {}} 
          />
        </>
      )}
    </div>
  );
}