// "use client";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X, Zap, Clock, Check, ChevronRight, ArrowDownLeft, 
//   Fuel, Utensils, ShoppingBag, Layers, MessageSquare, HandCoins
// } from "lucide-react";

// // Updated to 3 main tabs: Spend, IPO, Receive
// const TYPES = [
//   { id: "SPEND", label: "Spend", icon: Zap, color: "bg-slate-900" },
//   { id: "IPO_HOLD", label: "IPO", icon: Clock, color: "bg-amber-500" },
//   { id: "RECEIVED", label: "Receive", icon: ArrowDownLeft, color: "bg-emerald-500" },
// ];

// // Added "Lent" here so it's treated as a Spend category
// const CATEGORIES = [
//   { id: "Food", icon: Utensils },
//   { id: "Petrol", icon: Fuel },
//   { id: "Shopping", icon: ShoppingBag },
//   { id: "Other", icon: Layers },
// ];

// export default function AddTransactionModal({ isOpen, onClose, onRefresh }) {
//   const [type, setType] = useState("SPEND");
//   const [amount, setAmount] = useState("");
//   const [name, setName] = useState(""); 
//   const [category, setCategory] = useState("Other");
//   const [loading, setLoading] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const userId = localStorage.getItem("cc_user_id");

//     const finalName = type === "SPEND" && category === "Petrol" ? "Petrol Refill" : name;

//     try {
//       const res = await fetch("/api/transactions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           name: finalName,
//           amount: parseFloat(amount),
//           type,
//           category: type === "SPEND" ? category : "System",
//         }),
//       });

//       if (res.ok) {
//         setIsSuccess(true);
//         setTimeout(() => {
//           onClose();
//           onRefresh();
//           setTimeout(() => {
//             setIsSuccess(false);
//             setAmount("");
//             setName("");
//             setCategory("Other");
//           }, 300);
//         }, 2000);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={!isSuccess ? onClose : null} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[110]" />
//           <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] z-[120] px-8 pt-4 pb-12 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
//             <AnimatePresence mode="wait">
//               {isSuccess ? (
//                 <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 flex flex-col items-center justify-center text-center">
//                   <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-100 mb-8">
//                     <Check size={44} className="text-white" strokeWidth={4} />
//                   </div>
//                   <h2 className="text-3xl font-black text-slate-900 uppercase">Success</h2>
//                   <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-widest">Vault Updated</p>
//                 </motion.div>
//               ) : (
//                 <motion.div key="form">
//                   <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
//                   <div className="flex justify-between items-center mb-8">
//                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add Record</h2>
//                     <button onClick={onClose} className="w-10 h-10 bg-slate-50 rounded-2xl text-slate-400 flex items-center justify-center"><X size={20} /></button>
//                   </div>

//                   <form onSubmit={handleSubmit} className="space-y-8">
//                     {/* 1. Global Type Selector (Spend, IPO, Receive) */}
//                     <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-[2rem]">
//                       {TYPES.map((t) => (
//                         <button key={t.id} type="button" onClick={() => setType(t.id)} className={`relative py-4 rounded-[1.4rem] flex flex-col items-center gap-1 transition-all ${type === t.id ? "text-white shadow-xl" : "text-slate-400"}`}>
//                           {type === t.id && <motion.div layoutId="activeType" className={`absolute inset-0 ${t.color} rounded-[1.4rem]`} />}
//                           <t.icon size={18} className="relative z-10" />
//                           <span className="relative z-10 text-[8px] font-black uppercase tracking-tighter">{t.label}</span>
//                         </button>
//                       ))}
//                     </div>

//                     {/* 2. Amount Input */}
//                     <div className="text-center">
//                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Amount</p>
//                        <div className="flex items-center justify-center gap-2">
//                           <span className="text-3xl font-black text-slate-600">₹</span>
//                           <input type="number" required placeholder="0" autoFocus style={{ fontSize: amount.length > 7 ? "3rem" : "4.5rem" }} className="w-full max-w-[280px] font-black text-center outline-none bg-transparent text-slate-900 placeholder:text-slate-100 transition-all" value={amount} onChange={(e) => setAmount(e.target.value)} />
//                        </div>
//                     </div>

//                     {/* 3. Conditional Category Selector: ONLY for Spend */}
//                     <AnimatePresence>
//                       {type === "SPEND" && (
//                         <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
//                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-4">Category</p>
//                           <div className="grid grid-cols-5 gap-2">
//                             {CATEGORIES.map((cat) => (
//                               <button key={cat.id} type="button" onClick={() => setCategory(cat.id)} className={`py-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${category === cat.id ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm" : "bg-white border-slate-100 text-slate-400"}`}>
//                                 <cat.icon size={16} />
//                                 <span className="text-[8px] font-bold uppercase">{cat.id}</span>
//                               </button>
//                             ))}
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>

//                     {/* 4. Conditional Short Note: Hidden for Petrol */}
//                     <AnimatePresence>
//                       {(type !== "SPEND" || (type === "SPEND" && category !== "Petrol")) && (
//                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-5 focus-within:bg-white focus-within:border-blue-200 transition-all">
//                           <div className="flex items-center gap-3">
//                             <MessageSquare size={18} className="text-slate-300" />
//                             <input type="text" required placeholder={type === "SPEND" ? `Note for ${category}...` : "Short note..."} className="w-full bg-transparent outline-none font-bold text-slate-900 placeholder:text-slate-200 text-lg" value={name} onChange={(e) => setName(e.target.value)} />
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>

//                     <motion.button whileTap={{ scale: 0.98 }} disabled={loading || !amount || (type !== "SPEND" && !name) || (type === "SPEND" && category !== "Petrol" && !name)} className="w-full bg-slate-900 text-white h-20 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl disabled:opacity-20 transition-all">
//                       {loading ? "Syncing..." : "Confirm Entry"}
//                     </motion.button>
//                   </form>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }






//ai3
// "use client";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X, Zap, Clock, Check, ChevronRight, ArrowDownLeft, 
//   Fuel, Utensils, ShoppingBag, Layers, MessageSquare
// } from "lucide-react";

// const TYPES = [
//   { id: "SPEND", label: "Spend", icon: Zap, color: "bg-slate-900" },
//   { id: "IPO_HOLD", label: "IPO", icon: Clock, color: "bg-amber-500" },
//   { id: "RECEIVED", label: "Receive", icon: ArrowDownLeft, color: "bg-emerald-500" },
// ];

// const CATEGORIES = [
//   { id: "Food", icon: Utensils },
//   { id: "Petrol", icon: Fuel },
//   { id: "Shopping", icon: ShoppingBag },
//   { id: "Other", icon: Layers },
// ];

// export default function AddTransactionModal({ isOpen, onClose, onRefresh }) {
//   const [type, setType] = useState("SPEND");
//   const [amount, setAmount] = useState("");
//   const [name, setName] = useState(""); 
//   const [category, setCategory] = useState("Other");
//   const [loading, setLoading] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const userId = localStorage.getItem("cc_user_id");

//     // Logic: Auto-fill name for Petrol to keep records consistent
//     const finalName = type === "SPEND" && category === "Petrol" ? "Petrol Refill" : name;

//     try {
//       const res = await fetch("/api/transactions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           name: finalName,
//           amount: parseFloat(amount),
//           type,
//           category: type === "SPEND" ? category : "System",
//         }),
//       });

//       if (res.ok) {
//         setIsSuccess(true);
//         setTimeout(() => {
//           onClose();
//           onRefresh();
//           setTimeout(() => {
//             setIsSuccess(false);
//             setAmount("");
//             setName("");
//             setCategory("Other");
//           }, 300);
//         }, 2000);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={!isSuccess ? onClose : null} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[110]" />
//           <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] z-[120] px-8 pt-4 pb-12 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
//             <AnimatePresence mode="wait">
//               {isSuccess ? (
//                 <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 flex flex-col items-center justify-center text-center">
//                   <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-100 mb-8">
//                     <Check size={44} className="text-white" strokeWidth={4} />
//                   </div>
//                   <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Success</h2>
//                   <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-widest">Vault Updated</p>
//                 </motion.div>
//               ) : (
//                 <motion.div key="form">
//                   <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
//                   <div className="flex justify-between items-center mb-8">
//                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add Record</h2>
//                     <button onClick={onClose} className="w-10 h-10 bg-slate-50 rounded-2xl text-slate-400 flex items-center justify-center"><X size={20} /></button>
//                   </div>

//                   <form onSubmit={handleSubmit} className="space-y-8">
//                     <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-[2rem]">
//                       {TYPES.map((t) => (
//                         <button key={t.id} type="button" onClick={() => setType(t.id)} className={`relative py-4 rounded-[1.4rem] flex flex-col items-center gap-1 transition-all ${type === t.id ? "text-white shadow-xl" : "text-slate-400"}`}>
//                           {type === t.id && <motion.div layoutId="activeType" className={`absolute inset-0 ${t.color} rounded-[1.4rem]`} />}
//                           <t.icon size={18} className="relative z-10" />
//                           <span className="relative z-10 text-[8px] font-black uppercase tracking-tighter">{t.label}</span>
//                         </button>
//                       ))}
//                     </div>

//                     <div className="text-center">
//                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Amount</p>
//                        <div className="flex items-center justify-center gap-2">
//                           <span className="text-3xl font-black text-slate-600">₹</span>
//                           <input type="number" required placeholder="0" autoFocus style={{ fontSize: amount.length > 7 ? "3rem" : "4.5rem" }} className="w-full max-w-[280px] font-black text-center outline-none bg-transparent text-slate-900 placeholder:text-slate-100" value={amount} onChange={(e) => setAmount(e.target.value)} />
//                        </div>
//                     </div>

//                     <AnimatePresence>
//                       {type === "SPEND" && (
//                         <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
//                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-4">Category</p>
//                           <div className="grid grid-cols-4 gap-3">
//                             {CATEGORIES.map((cat) => (
//                               <button key={cat.id} type="button" onClick={() => setCategory(cat.id)} className={`py-4 rounded-3xl border transition-all flex flex-col items-center gap-2 ${category === cat.id ? "bg-blue-600 text-white shadow-lg border-blue-600" : "bg-white border-slate-100 text-slate-400"}`}>
//                                 <cat.icon size={18} />
//                                 <span className="text-[9px] font-bold uppercase">{cat.id}</span>
//                               </button>
//                             ))}
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>

//                     <AnimatePresence>
//                       {(type !== "SPEND" || (type === "SPEND" && category !== "Petrol")) && (
//                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-5 focus-within:bg-white focus-within:border-blue-200 transition-all">
//                           <div className="flex items-center gap-3">
//                             <MessageSquare size={18} className="text-slate-300" />
//                             <input type="text" required placeholder={type === "SPEND" ? `Note for ${category}...` : "Short note..."} className="w-full bg-transparent outline-none font-bold text-slate-900 placeholder:text-slate-200 text-lg" value={name} onChange={(e) => setName(e.target.value)} />
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>

//                     <motion.button whileTap={{ scale: 0.98 }} disabled={loading || !amount || (type !== "SPEND" && !name) || (type === "SPEND" && category !== "Petrol" && !name)} className="w-full bg-slate-900 text-white h-20 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl disabled:opacity-20 transition-all">
//                       {loading ? "Establishing Link..." : "Confirm Entry"}
//                     </motion.button>
//                   </form>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }















// ai4
// "use client";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X, Zap, Clock, Check, ArrowDownLeft, 
//   Fuel, Utensils, ShoppingBag, Layers, MessageSquare
// } from "lucide-react";

// const TYPES = [
//   { id: "SPEND", label: "Spend", icon: Zap, color: "bg-slate-900" },
//   { id: "IPO_HOLD", label: "IPO", icon: Clock, color: "bg-amber-500" },
//   { id: "RECEIVED", label: "Receive", icon: ArrowDownLeft, color: "bg-emerald-500" },
// ];

// const CATEGORIES = [
//   { id: "Food", icon: Utensils },
//   { id: "Petrol", icon: Fuel },
//   { id: "Shopping", icon: ShoppingBag },
//   { id: "Other", icon: Layers },
// ];

// export default function AddTransactionModal({ isOpen, onClose }) {
//   const [type, setType] = useState("SPEND");
//   const [amount, setAmount] = useState("");
//   const [name, setName] = useState(""); 
//   const [category, setCategory] = useState("Other");
//   const [loading, setLoading] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const userId = localStorage.getItem("cc_user_id");

//     // Logic: Auto-fill name for Petrol to keep records consistent
//     const finalName = type === "SPEND" && category === "Petrol" ? "Petrol Refill" : name;

//     try {
//       const res = await fetch("/api/transactions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           name: finalName,
//           amount: parseFloat(amount),
//           type,
//           category: type === "SPEND" ? category : "System",
//         }),
//       });

//       if (res.ok) {
//         setIsSuccess(true);
        
//         // --- TIMED ORCHESTRATION ---
//         setTimeout(() => {
//           // 1. Trigger the slide-down animation
//           onClose(); 
          
//           // 2. Alert the Dashboard to wait 800ms then roll numbers
//           window.dispatchEvent(new Event("vault-update")); 

//           // 3. Reset the form state after it's fully hidden
//           setTimeout(() => {
//             setIsSuccess(false);
//             setAmount("");
//             setName("");
//             setCategory("Other");
//             setType("SPEND");
//           }, 600); 
//         }, 1500); // Success message visible for 1.5s
//       }
//     } catch (err) {
//       console.error("Transaction Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div 
//             initial={{ opacity: 0 }} 
//             animate={{ opacity: 1 }} 
//             exit={{ opacity: 0 }} 
//             onClick={!isSuccess ? onClose : null} 
//             className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[130]" 
//           />

//           {/* Modal Sheet */}
//           <motion.div 
//             initial={{ y: "100%" }} 
//             animate={{ y: 0 }} 
//             exit={{ y: "100%" }} 
//             transition={{ type: "spring", damping: 30, stiffness: 300 }} 
//             className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] z-[140] px-8 pt-4 pb-12 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
//           >
//             <AnimatePresence mode="wait">
//               {isSuccess ? (
//                 /* SUCCESS STATE */
//                 <motion.div 
//                   key="success" 
//                   initial={{ opacity: 0, scale: 0.9 }} 
//                   animate={{ opacity: 1, scale: 1 }} 
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   className="py-12 flex flex-col items-center justify-center text-center"
//                 >
//                   <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200 mb-8">
//                     <Check size={44} className="text-white" strokeWidth={4} />
//                   </div>
//                   <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Success</h2>
//                   <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-widest">Vault Updated</p>
//                 </motion.div>
//               ) : (
//                 /* FORM STATE */
//                 <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//                   <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
                  
//                   <div className="flex justify-between items-center mb-8">
//                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add Record</h2>
//                     <button onClick={onClose} className="w-10 h-10 bg-slate-50 rounded-2xl text-slate-400 flex items-center justify-center">
//                       <X size={20} />
//                     </button>
//                   </div>

//                   <form onSubmit={handleSubmit} className="space-y-8">
//                     {/* Transaction Type Toggles */}
//                     <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-[2rem]">
//                       {TYPES.map((t) => (
//                         <button 
//                           key={t.id} 
//                           type="button" 
//                           onClick={() => setType(t.id)} 
//                           className={`relative py-4 rounded-[1.4rem] flex flex-col items-center gap-1 transition-all ${type === t.id ? "text-white shadow-xl" : "text-slate-400"}`}
//                         >
//                           {type === t.id && (
//                             <motion.div 
//                               layoutId="activeType" 
//                               className={`absolute inset-0 ${t.color} rounded-[1.4rem]`} 
//                             />
//                           )}
//                           <t.icon size={18} className="relative z-10" />
//                           <span className="relative z-10 text-[8px] font-black uppercase tracking-tighter">{t.label}</span>
//                         </button>
//                       ))}
//                     </div>

//                     {/* Amount Input */}
//                     <div className="text-center">
//                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Amount</p>
//                        <div className="flex items-center justify-center gap-2">
//                           <span className="text-3xl font-black text-slate-300">₹</span>
//                           <input 
//                             type="number" 
//                             required 
//                             placeholder="0" 
//                             autoFocus 
//                             style={{ fontSize: amount.length > 5 ? "3.5rem" : "4.5rem" }} 
//                             className="w-full max-w-[280px] font-black text-center outline-none bg-transparent text-slate-900 placeholder:text-slate-100" 
//                             value={amount} 
//                             onChange={(e) => setAmount(e.target.value)} 
//                           />
//                        </div>
//                     </div>

//                     {/* Category Selector (SPEND Only) */}
//                     <AnimatePresence>
//                       {type === "SPEND" && (
//                         <motion.div 
//                           initial={{ opacity: 0, height: 0 }} 
//                           animate={{ opacity: 1, height: "auto" }} 
//                           exit={{ opacity: 0, height: 0 }} 
//                           className="space-y-3 overflow-hidden"
//                         >
//                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-4">Category</p>
//                           <div className="grid grid-cols-4 gap-3">
//                             {CATEGORIES.map((cat) => (
//                               <button 
//                                 key={cat.id} 
//                                 type="button" 
//                                 onClick={() => setCategory(cat.id)} 
//                                 className={`py-4 rounded-3xl border transition-all flex flex-col items-center gap-2 ${category === cat.id ? "bg-blue-600 text-white shadow-lg border-blue-600" : "bg-white border-slate-100 text-slate-400"}`}
//                               >
//                                 <cat.icon size={18} />
//                                 <span className="text-[9px] font-bold uppercase">{cat.id}</span>
//                               </button>
//                             ))}
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>

//                     {/* Note Input */}
//                     <AnimatePresence>
//                       {(type !== "SPEND" || (type === "SPEND" && category !== "Petrol")) && (
//                         <motion.div 
//                           initial={{ opacity: 0, y: 10 }} 
//                           animate={{ opacity: 1, y: 0 }} 
//                           exit={{ opacity: 0, y: 10 }} 
//                           className="bg-slate-50 border border-slate-100 rounded-[2rem] p-5 focus-within:bg-white focus-within:border-blue-200 transition-all"
//                         >
//                           <div className="flex items-center gap-3">
//                             <MessageSquare size={18} className="text-slate-300" />
//                             <input 
//                               type="text" 
//                               required 
//                               placeholder={type === "SPEND" ? `Note for ${category}...` : "Short note..."} 
//                               className="w-full bg-transparent outline-none font-bold text-slate-900 placeholder:text-slate-200 text-lg" 
//                               value={name} 
//                               onChange={(e) => setName(e.target.value)} 
//                             />
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>

//                     {/* CTA Button */}
//                     <motion.button 
//                       whileTap={{ scale: 0.98 }} 
//                       disabled={loading || !amount || (type !== "SPEND" && !name) || (type === "SPEND" && category !== "Petrol" && !name)} 
//                       className="w-full bg-slate-900 text-white h-20 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl disabled:opacity-20 transition-all"
//                     >
//                       {loading ? "Establishing Link..." : "Confirm Entry"}
//                     </motion.button>
//                   </form>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }




















// ai5
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Zap, Clock, Check, ArrowDownLeft, 
  Fuel, Utensils, ShoppingBag, Layers, MessageSquare
} from "lucide-react";

const TYPES = [
  { id: "SPEND", label: "Spend", icon: Zap, color: "bg-slate-900" },
  { id: "IPO_HOLD", label: "IPO", icon: Clock, color: "bg-amber-500" },
  { id: "RECEIVED", label: "Receive", icon: ArrowDownLeft, color: "bg-emerald-500" },
];

const CATEGORIES = [
  { id: "Food", icon: Utensils },
  { id: "Petrol", icon: Fuel },
  { id: "Shopping", icon: ShoppingBag },
  { id: "Other", icon: Layers },
];

export default function AddTransactionModal({ isOpen, onClose }) {
  const [type, setType] = useState("SPEND");
  const [amount, setAmount] = useState(""); // Raw number for DB
  const [displayAmount, setDisplayAmount] = useState(""); // Formatted with commas
  const [name, setName] = useState(""); 
  const [category, setCategory] = useState("Other");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Helper to format currency for input as user types
  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, ""); // Remove existing commas
    if (!isNaN(rawValue)) {
      setAmount(rawValue);
      // Formats as Indian Currency (e.g., 15,000)
      setDisplayAmount(Number(rawValue).toLocaleString('en-IN'));
    } else if (rawValue === "") {
      setAmount("");
      setDisplayAmount("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userId = localStorage.getItem("cc_user_id");
    const finalName = type === "SPEND" && category === "Petrol" ? "Petrol Refill" : name;

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: finalName,
          amount: parseFloat(amount),
          type,
          category: type === "SPEND" ? category : "System",
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose(); 
          window.dispatchEvent(new Event("vault-update")); 
          setTimeout(() => {
            setIsSuccess(false);
            setAmount("");
            setDisplayAmount("");
            setName("");
            setCategory("Other");
            setType("SPEND");
          }, 600); 
        }, 1500);
      }
    } catch (err) {
      console.error("Transaction Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={!isSuccess ? onClose : null} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[130]" />
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] z-[140] px-8 pt-4 pb-12 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200 mb-8">
                    <Check size={44} className="text-white" strokeWidth={4} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Success</h2>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add Record</h2>
                    <button onClick={onClose} className="w-10 h-10 bg-slate-50 rounded-2xl text-slate-400 flex items-center justify-center"><X size={20} /></button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-[2rem]">
                      {TYPES.map((t) => (
                        <button key={t.id} type="button" onClick={() => setType(t.id)} className={`relative py-4 rounded-[1.4rem] flex flex-col items-center gap-1 transition-all ${type === t.id ? "text-white shadow-xl" : "text-slate-400"}`}>
                          {type === t.id && <motion.div layoutId="activeType" className={`absolute inset-0 ${t.color} rounded-[1.4rem]`} />}
                          <t.icon size={18} className="relative z-10" />
                          <span className="relative z-10 text-[8px] font-black uppercase tracking-tighter">{t.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Amount</p>
                       <div className="flex items-center justify-center gap-2">
                          <span className="text-3xl font-black text-slate-300">₹</span>
                          <input 
                            type="text" 
                            inputMode="numeric"
                            required 
                            placeholder="0" 
                            autoFocus 
                            style={{ fontSize: displayAmount.length > 7 ? "3.5rem" : "4.5rem" }} 
                            className="w-full max-w-[320px] font-black text-center outline-none bg-transparent text-slate-900 placeholder:text-slate-100" 
                            value={displayAmount} 
                            onChange={handleAmountChange} 
                          />
                       </div>
                    </div>
                    <AnimatePresence>
                      {type === "SPEND" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-4">Category</p>
                          <div className="grid grid-cols-4 gap-3">
                            {CATEGORIES.map((cat) => (
                              <button key={cat.id} type="button" onClick={() => setCategory(cat.id)} className={`py-4 rounded-3xl border transition-all flex flex-col items-center gap-2 ${category === cat.id ? "bg-blue-600 text-white shadow-lg border-blue-600" : "bg-white border-slate-100 text-slate-400"}`}>
                                <cat.icon size={18} />
                                <span className="text-[9px] font-bold uppercase">{cat.id}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <AnimatePresence>
                      {(type !== "SPEND" || (type === "SPEND" && category !== "Petrol")) && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-5 focus-within:bg-white focus-within:border-blue-200 transition-all">
                          <div className="flex items-center gap-3">
                            <MessageSquare size={18} className="text-slate-300" />
                            <input type="text" required placeholder={type === "SPEND" ? `Note for ${category}...` : "Short note..."} className="w-full bg-transparent outline-none font-bold text-slate-900 text-lg" value={name} onChange={(e) => setName(e.target.value)} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.button whileTap={{ scale: 0.98 }} disabled={loading || !amount || (type !== "SPEND" && !name) || (type === "SPEND" && category !== "Petrol" && !name)} className="w-full bg-slate-900 text-white h-20 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl disabled:opacity-20 transition-all">
                      {loading ? "Recording..." : "Confirm Entry"}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}