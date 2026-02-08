"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if the user has an initial balance set in the database
    // For now, we check a local flag or just try to fetch the status
    async function checkStatus() {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();

        // If there are no transactions, it's a first-time user
        if (!data || data.length === 0) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        // If DB is empty or connection fails, assume first-time setup
        router.push("/onboarding");
      }
    }

    checkStatus();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-bank-blue animate-pulse">
          ClearCash
        </h1>
        <p className="text-sm text-gray-400 mt-2">Checking your wallet...</p>
      </div>
    </div>
  );
}