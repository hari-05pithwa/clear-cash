// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { formatCurrency, formatDate } from "@/lib/utils";
// import { calculateTotals } from "@/lib/calculations";
// import {
//   Plus,
//   ArrowUpRight,
//   Clock,
//   Wallet,
//   LayoutGrid,
//   Zap,
//   ArrowRight,
//   Home,
//   PieChart,
//   History,
//   Settings,
//   Globe,
//   ShieldCheck,
// } from "lucide-react";
// import { motion } from "framer-motion";

// export default function Dashboard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     fetch("/api/transactions")
//       .then((res) => res.json())
//       .then((json) => {
//         const stats = calculateTotals(json);
//         setData({ transactions: json, stats });
//         setLoading(false);
//       });
//   }, []);

//   if (loading)
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-white">
//         <motion.div
//           animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
//           transition={{ repeat: Infinity, duration: 1.5 }}
//           className="text-blue-600 font-black text-2xl tracking-tighter"
//         >
//           CC
//         </motion.div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#FDFDFF] p-6 pb-40 text-slate-900">
//       {/* Header */}
//       <header className="pt-6 flex justify-between items-center mb-8">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
//             <span className="text-white text-xs font-black">CC</span>
//           </div>
//           <h2 className="font-black text-lg tracking-tight">ClearCash</h2>
//         </div>
//         <motion.button
//           whileTap={{ scale: 0.9 }}
//           onClick={() => router.push("/settings")}
//           className="w-10 h-10 bg-white shadow-lg shadow-slate-100 rounded-xl flex items-center justify-center border border-slate-50"
//         >
//           <LayoutGrid size={18} className="text-slate-400" />
//         </motion.button>
//       </header>

//       {/* Dual Hero Bento Cards */}
//       <section className="space-y-4 mb-8">
//         {/* Total Bank Assets Card (The Reality) */}
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-7 text-white shadow-2xl shadow-slate-200"
//         >
//           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
//           <div className="relative z-10">
//             <div className="flex items-center gap-2 mb-2">
//               <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md">
//                 <Globe size={14} className="text-blue-400" />
//               </div>
//               <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
//                 Total Bank Balance
//               </span>
//             </div>
//             <h2 className="text-4xl font-black tracking-tighter mb-4">
//               {formatCurrency(data.stats.bankBalance)}
//             </h2>
//             <div className="flex justify-between items-center pt-4 border-t border-white/5">
//               <p className="text-[10px] font-medium opacity-50 uppercase tracking-tight">
//                 Actual Bank Balance
//               </p>
//               <ArrowRight size={16} className="opacity-30" />
//             </div>
//           </div>
//         </motion.div>

//         {/* Safe to Spend Card (The Actionable) */}
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.1 }}
//           className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] p-7 text-white shadow-2xl shadow-emerald-100"
//         >
//           <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10" />
//           <div className="relative z-10">
//             <div className="flex items-center gap-2 mb-2">
//               <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
//                 <ShieldCheck size={14} className="text-white" />
//               </div>
//               <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">
//                 Safe to Spend
//               </span>
//             </div>
//             <h2 className="text-4xl font-black tracking-tighter mb-4">
//               {formatCurrency(data.stats.safeToSpend)}
//             </h2>
//             <div className="flex justify-between items-center pt-4 border-t border-white/10">
//               <p className="text-[10px] font-medium opacity-90 uppercase tracking-tight">
//                 Spendable Amount
//               </p>
//               <Zap size={16} className="fill-white text-white opacity-50" />
//             </div>
//           </div>
//         </motion.div>
//       </section>

//       {/* Stats Grid */}
//       <section className="grid grid-cols-2 gap-4 mb-10">
//         <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm">
//           <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center mb-3">
//             <Clock size={16} className="text-amber-500" />
//           </div>
//           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//             IPO Blocked
//           </p>
//           <p className="text-lg font-black text-slate-900">
//             {formatCurrency(data.stats.totalLocked)}
//           </p>
//         </div>
//         <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm">
//           <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
//             <ArrowUpRight size={16} className="text-blue-500" />
//           </div>
//           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//             Receivables
//           </p>
//           <p className="text-lg font-black text-slate-900">
//             {formatCurrency(data.stats.totalLent)}
//           </p>
//         </div>
//       </section>

//       {/* Timeline */}
//       <section className="mb-12">
//         <div className="flex justify-between items-center mb-6 px-1">
//           <h3 className="text-lg font-black tracking-tight text-slate-900">
//             Activity Timeline
//           </h3>
//           <button
//             onClick={() => router.push("/history")}
//             className="text-[10px] font-bold uppercase text-blue-600"
//           >
//             History
//           </button>
//         </div>
//         <div className="space-y-6">
//           {data.transactions.map((tx, i) => (
//             <motion.div
//               key={tx._id}
//               initial={{ x: -10, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: i * 0.05 }}
//               className="flex items-center justify-between"
//             >
//               <div className="flex items-center gap-4">
//                 <div
//                   className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === "SPEND" ? "bg-slate-50 text-slate-400" : tx.type === "IPO_HOLD" ? "bg-amber-50 text-amber-500" : "bg-green-50 text-green-500"}`}
//                 >
//                   {tx.type === "SPEND" ? (
//                     <Zap size={18} />
//                   ) : tx.type === "IPO_HOLD" ? (
//                     <Clock size={18} />
//                   ) : (
//                     <Wallet size={18} />
//                   )}
//                 </div>
//                 <div>
//                   <h4 className="font-bold text-sm text-slate-800">
//                     {tx.name}
//                   </h4>
//                   <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
//                     {tx.category}
//                   </p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p
//                   className={`text-sm font-black ${tx.type === "RECEIVED" || tx.type === "INITIAL" ? "text-emerald-600" : "text-slate-900"}`}
//                 >
//                   {tx.type === "RECEIVED" || tx.type === "INITIAL" ? "+" : "-"}
//                   {formatCurrency(tx.amount)}
//                 </p>
//                 <p className="text-[8px] font-bold text-slate-300 uppercase">
//                   {formatDate(tx.timestamp)}
//                 </p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* FAB sitting high above Nav */}
//       <div className="fixed bottom-28 left-0 right-0 flex justify-center z-[100] pointer-events-none px-6">
//         <motion.button
//           whileTap={{ scale: 0.95 }}
//           className="pointer-events-auto w-full max-w-xs bg-slate-900 text-white py-4 rounded-3xl shadow-2xl flex items-center justify-center gap-3 border border-white/10 active:bg-blue-600 transition-all"
//         >
//           <Plus size={20} strokeWidth={3} />
//           <span className="text-xs font-bold uppercase tracking-widest">
//             Add New Record
//           </span>
//         </motion.button>
//       </div>

//       {/* BOTTOM NAV */}
//       <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-50 px-8 py-4 pb-10 z-[90] flex justify-between items-center">
//         <button className="flex flex-col items-center gap-1 text-blue-600">
//           <Home size={24} strokeWidth={2.5} />
//           <span className="text-[9px] font-black uppercase tracking-tight">
//             Home
//           </span>
//         </button>
//         <button
//           onClick={() => router.push("/insights")}
//           className="flex flex-col items-center gap-1 text-slate-300"
//         >
//           <PieChart size={24} />
//           <span className="text-[9px] font-black uppercase tracking-tight">
//             Insights
//           </span>
//         </button>
//         <button
//           onClick={() => router.push("/history")}
//           className="flex flex-col items-center gap-1 text-slate-300"
//         >
//           <History size={24} />
//           <span className="text-[9px] font-black uppercase tracking-tight">
//             History
//           </span>
//         </button>
//         <button
//           onClick={() => router.push("/settings")}
//           className="flex flex-col items-center gap-1 text-slate-300"
//         >
//           <Settings size={24} />
//           <span className="text-[9px] font-black uppercase tracking-tight">
//             More
//           </span>
//         </button>
//       </nav>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { calculateTotals } from "@/lib/calculations";
import { 
  Plus, 
  ArrowUpRight, 
  Clock, 
  Wallet, 
  LayoutGrid, 
  Zap, 
  ArrowRight, 
  Home, 
  PieChart, 
  History, 
  Settings, 
  Globe, 
  ShieldCheck 
} from "lucide-react";
import { motion } from "framer-motion";
import AddTransactionModal from "@/components/dashboard/AddTransactionModal";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  const fetchTransactions = () => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((json) => {
        const stats = calculateTotals(json);
        setData({ transactions: json, stats });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshKey]); // Refetch when modal adds a record

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
        transition={{ repeat: Infinity, duration: 1.5 }} 
        className="text-blue-600 font-black text-2xl tracking-tighter"
      >
        CC
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] p-6 pb-40 text-slate-900">
      {/* 1. Header Section */}
      <header className="pt-6 flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black">CC</span>
          </div>
          <h2 className="font-black text-lg tracking-tight">ClearCash</h2>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }} 
          onClick={() => router.push("/settings")} 
          className="w-10 h-10 bg-white shadow-lg shadow-slate-100 rounded-xl flex items-center justify-center border border-slate-50"
        >
          <LayoutGrid size={18} className="text-slate-400" />
        </motion.button>
      </header>

      {/* 2. Dual Bento Hero Cards */}
      <section className="space-y-4 mb-8">
        {/* Total Bank Assets Card (The Reality) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-7 text-white shadow-2xl shadow-slate-200"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md">
                <Globe size={14} className="text-blue-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Bank Balance</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter mb-4">
              {formatCurrency(data.stats.bankBalance)}
            </h2>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <p className="text-[10px] font-medium opacity-50 uppercase tracking-tight">Actual Bank Balance</p>
              <ArrowRight size={16} className="opacity-30" />
            </div>
          </div>
        </motion.div>

        {/* Safe to Spend Card (The Actionable) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-7 text-white shadow-2xl shadow-blue-100"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                <ShieldCheck size={14} className="text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">Safe to Spend</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter mb-4">
              {formatCurrency(data.stats.safeToSpend)}
            </h2>
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <p className="text-[10px] font-medium opacity-90 uppercase tracking-tight">Spendable Amount</p>
              <Zap size={16} className="fill-white text-white opacity-50" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Small Stats Bento Grid */}
      <section className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white border border-slate-100 p-5 rounded-[2.2rem] shadow-sm">
          <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center mb-3">
            <Clock size={16} className="text-amber-500" />
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">IPO Blocked</p>
          <p className="text-lg font-black text-slate-900">{formatCurrency(data.stats.totalLocked)}</p>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-[2.2rem] shadow-sm">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
            <ArrowUpRight size={16} className="text-blue-500" />
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Receivables</p>
          <p className="text-lg font-black text-slate-900">{formatCurrency(data.stats.totalLent)}</p>
        </div>
      </section>

      {/* 4. Timeline Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6 px-1">
          <h3 className="text-lg font-black tracking-tight text-slate-900">Activity Timeline</h3>
          <button 
            onClick={() => router.push("/history")} 
            className="text-[10px] font-bold uppercase text-blue-600 hover:opacity-70 transition-opacity"
          >
            History
          </button>
        </div>
        <div className="space-y-6">
          {data.transactions.map((tx, i) => (
            <motion.div 
              key={tx._id} 
              initial={{ x: -10, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  tx.type === 'SPEND' ? 'bg-slate-50 text-slate-400' : 
                  tx.type === 'IPO_HOLD' ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'
                }`}>
                  {tx.type === 'SPEND' ? <Zap size={18} /> : tx.type === 'IPO_HOLD' ? <Clock size={18} /> : <Wallet size={18} />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{tx.name}</h4>
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{tx.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${
                  tx.type === 'RECEIVED' || tx.type === 'INITIAL' ? 'text-emerald-600' : 'text-slate-900'
                }`}>
                  {tx.type === 'RECEIVED' || tx.type === 'INITIAL' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
                <p className="text-[8px] font-bold text-slate-300 uppercase">{formatDate(tx.timestamp)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Centered FAB sitting high above Navigation */}
      <div className="fixed bottom-28 left-0 right-0 flex justify-center z-[100] pointer-events-none px-6">
        <motion.button 
          whileTap={{ scale: 0.95 }} 
          onClick={() => setIsModalOpen(true)}
          className="pointer-events-auto w-full max-w-xs bg-slate-900 text-white py-4 rounded-3xl shadow-2xl flex items-center justify-center gap-3 border border-white/10 active:bg-blue-600 transition-all"
        >
          <Plus size={20} strokeWidth={3} />
          <span className="text-xs font-bold uppercase tracking-widest">Add New Record</span>
        </motion.button>
      </div>

      {/* 6. Self-Contained Manual Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-50 px-8 py-4 pb-10 z-[90] flex justify-between items-center">
        <button className="flex flex-col items-center gap-1 text-blue-600">
          <Home size={24} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-tight">Home</span>
        </button>
        <button onClick={() => router.push("/insights")} className="flex flex-col items-center gap-1 text-slate-300">
          <PieChart size={24} />
          <span className="text-[9px] font-black uppercase tracking-tight">Insights</span>
        </button>
        <button onClick={() => router.push("/history")} className="flex flex-col items-center gap-1 text-slate-300">
          <History size={24} />
          <span className="text-[9px] font-black uppercase tracking-tight">History</span>
        </button>
        <button onClick={() => router.push("/settings")} className="flex flex-col items-center gap-1 text-slate-300">
          <Settings size={24} />
          <span className="text-[9px] font-black uppercase tracking-tight">More</span>
        </button>
      </nav>

      {/* Command Center Tray */}
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={() => setRefreshKey(prev => prev + 1)}
      />
    </div>
  );
}
