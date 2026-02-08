"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Search,
  Filter,
  Zap,
  Clock,
  Wallet,
  Home,
  PieChart,
  History,
  Settings,
  CalendarDays,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Fuel,
  Utensils,
  ShoppingBag,
  Layers,
  ArrowDownLeft,
} from "lucide-react";
import { motion } from "framer-motion";

// --- Icon Mapping Helper ---
const getTransactionIcon = (type, category) => {
  if (category === "Food") return <Utensils size={22} />;
  if (category === "Petrol") return <Fuel size={22} />;
  if (category === "Shopping") return <ShoppingBag size={22} />;
  if (category === "Other") return <Layers size={22} />;
  if (type === "IPO_HOLD") return <Clock size={22} />;
  if (type === "LENT") return <Wallet size={22} />;
  if (type === "RECEIVED" || type === "INITIAL")
    return <ArrowDownLeft size={22} />;
  return <Layers size={22} />;
};

export default function HistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("cc_user_id");
    if (!userId) {
      router.push("/onboarding");
      return;
    }

    fetch(`/api/transactions?userId=${userId}`)
      .then((res) => res.json())
      .then((json) => {
        setTransactions(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  // Logic to calculate running balances and group by day
  const dailyLedger = useMemo(() => {
    if (!transactions.length) return {};

    // 1. Sort oldest to newest to calculate running balance accurately
    const sortedOldest = [...transactions].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );

    let runningBalance = 0;
    const ledgerWithBalance = sortedOldest.map((tx, index) => {
      const amt = Number(tx.amount) || 0;

      // LOGIC FIX: For the very first "INITIAL" entry, opening and closing should match
      // the initial amount to show the starting point of the vault.
      let openingBalance = runningBalance;

      if (tx.type === "INITIAL") {
        runningBalance = amt;
        openingBalance = amt; // Opening for the first day is the initial deposit
      } else if (tx.type === "RECEIVED") {
        runningBalance += amt;
      } else {
        runningBalance -= amt;
      }

      return { ...tx, opening: openingBalance, closing: runningBalance };
    });

    // 2. Group by date (Newest day first)
    const groups = {};
    [...ledgerWithBalance].reverse().forEach((tx) => {
      const date = new Date(tx.timestamp).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      if (!groups[date]) groups[date] = { items: [], opening: 0, closing: 0 };
      groups[date].items.push(tx);
    });

    // 3. Set Opening/Closing for the day
    Object.keys(groups).forEach((date) => {
      const items = groups[date].items;
      // Day Opening = the opening balance of the earliest entry of that day (last in reversed list)
      groups[date].opening = items[items.length - 1].opening;
      // Day Closing = the final balance after the last entry of that day (first in reversed list)
      groups[date].closing = items[0].closing;
    });

    return groups;
  }, [transactions]);

  if (loading)
    return (
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
    <div className="min-h-screen bg-[#FDFDFF] font-sans text-slate-900 pb-40">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-slate-100/50 px-6 pt-12 pb-6">
        <div className="flex justify-between items-center mb-8">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push("/dashboard")}
            className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-[1.25rem] flex items-center justify-center transition-all"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </motion.button>
          <div className="text-center">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
              Archive
            </h1>
          </div>
          <div className="w-12" />
        </div>

        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search archive..."
            className="w-full bg-slate-100/50 border-transparent rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </header>

      {transactions.length > 0 ? (
        <section className="px-6 py-8">
          {Object.entries(dailyLedger).map(([date, data]) => (
            <div key={date} className="mb-14">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                  {date}
                </h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-100 to-transparent" />
              </div>

              {/* Day Balance Summary Box */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm">
                  <div className="flex items-center gap-2 mb-1.5 opacity-40">
                    <ArrowUpRight size={12} className="text-emerald-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest">
                      Opening
                    </span>
                  </div>
                  <p className="text-[15px] font-black text-slate-900">
                    {formatCurrency(data.opening)}
                  </p>
                </div>
                <div className="bg-slate-900 p-5 rounded-[2rem] shadow-xl shadow-slate-100">
                  <div className="flex items-center gap-2 mb-1.5 opacity-60">
                    <ArrowDownRight size={12} className="text-blue-400" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white">
                      Closing
                    </span>
                  </div>
                  <p className="text-[15px] font-black text-white">
                    {formatCurrency(data.closing)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {data.items.map((tx, i) => (
                  <motion.div
                    key={tx._id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="group relative bg-white p-5 rounded-[2.2rem] border border-slate-50 shadow-sm transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${tx.type === "SPEND" ? "bg-slate-50 text-slate-900" : tx.type === "IPO_HOLD" ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-500"}`}
                        >
                          {getTransactionIcon(tx.type, tx.category)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[15px] text-slate-900 line-clamp-1">
                            {tx.name}
                          </h4>
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">
                            {tx.category || "Vault"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-base font-black tracking-tight ${tx.type === "RECEIVED" || tx.type === "INITIAL" ? "text-emerald-500" : "text-red-400"}`}
                        >
                          {tx.type === "RECEIVED" || tx.type === "INITIAL"
                            ? "+"
                            : "−"}
                          {formatCurrency(tx.amount).replace("₹", "")}
                        </p>
                        <p className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest mt-0.5">
                          {new Date(tx.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 text-slate-300">
            <CalendarDays size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
            Vault Empty
          </h2>
        </section>
      )}

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-50 px-10 py-5 pb-10 z-[90] flex justify-between items-center shadow-2xl">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex flex-col items-center gap-1.5 text-slate-400 outline-none"
        >
          <Home size={26} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-tighter">
            Vault
          </span>
        </button>
        <button
          onClick={() => router.push("/insights")}
          className="flex flex-col items-center gap-1.5 text-slate-400 outline-none"
        >
          <PieChart size={26} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-tighter">
            Insights
          </span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-blue-600 outline-none">
          <History size={26} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-tighter">
            Archive
          </span>
        </button>
        <button
          onClick={() => router.push("/settings")}
          className="flex flex-col items-center gap-1.5 text-slate-400 outline-none"
        >
          <Settings size={26} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-tighter">
            Vault ID
          </span>
        </button>
      </nav>
    </div>
  );
}
