"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function RecoveryPage() {
  const [vaultId, setVaultId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRecovery = async (e) => {
    e.preventDefault();
    setLoading(true);

    const rawId = vaultId.trim().toLowerCase();
    // Logic to handle IDs with or without the 'vault_' prefix
    const finalVaultId = rawId.startsWith("vault_") ? rawId : `vault_${rawId}`;

    try {
      // 1. Verify Vault existence via transactions
      const res = await fetch(`/api/transactions?userId=${finalVaultId}`);
      
      if (res.ok) {
        // 2. Fetch the actual profile name from the cloud database
        const userRes = await fetch(`/api/user?userId=${finalVaultId}`);
        const userData = await userRes.json();

        // 3. Restore the full session to LocalStorage
        localStorage.setItem("cc_user_id", finalVaultId);

        if (userData.firstName) {
          // RESTORE ORIGINAL IDENTITY
          localStorage.setItem("cc_first_name", userData.firstName);
          localStorage.setItem("cc_last_name", userData.lastName);
          toast.success(`Welcome back, ${userData.firstName}`);
        } else {
          // Fallback if cloud profile is missing
          localStorage.setItem("cc_first_name", "Authorized");
          localStorage.setItem("cc_last_name", "Holder");
          toast.info("Ledger synced successfully.");
        }

        router.push("/dashboard");
      } else {
        toast.error("Invalid Vault ID", {
            description: "No ledger found with this signature."
        });
      }
    } catch (err) {
      toast.error("Synchronisation Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans flex flex-col justify-center relative">
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[50%] bg-blue-50/50 blur-[120px] rounded-full" />
      
      <motion.button 
        onClick={() => router.push("/onboarding")}
        className="absolute top-12 left-8 w-12 h-12 bg-white/80 backdrop-blur-md shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400"
      >
        <ArrowLeft size={20} />
      </motion.button>

      <div className="max-w-sm mx-auto w-full px-8 relative z-10">
        <header className="text-center mb-12">
          <div className="w-24 h-24 bg-slate-900 rounded-[2.8rem] flex items-center justify-center mx-auto shadow-2xl mb-8">
            <Fingerprint size={44} className="text-blue-400" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Sync Vault</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Enter ID to restore ledger</p>
        </header>

        <form onSubmit={handleRecovery} className="space-y-6">
          <div className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-2 shadow-xl shadow-slate-200/30 transition-all">
            <input 
              type="text" 
              required 
              placeholder="PASTE VAULT ID"
              className="w-full bg-transparent py-6 px-4 font-black text-xs text-center uppercase outline-none text-slate-900 placeholder:text-slate-100 tracking-widest italic"
              value={vaultId} 
              onChange={(e) => setVaultId(e.target.value)} 
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading || vaultId.length < 5}
            className="w-full bg-slate-900 text-white h-20 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-20"
          >
            {loading ? "Decrypting..." : "Restore Session"}
            <ChevronRight size={18} className="text-blue-400" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}