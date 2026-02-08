// /**
//  * Calculates current status from a list of transactions
//  * Useful for the Dashboard and Analytics pages.
//  */
// export const calculateTotals = (transactions) => {
//   let totals = {
//     bankBalance: 0,
//     safeToSpend: 0,
//     totalLocked: 0, // IPOs
//     totalLent: 0,   // Money given to others
//     categoryWise: {},
//   };

//   if (!transactions || transactions.length === 0) return totals;

//   // Since transactions are sorted by newest first, 
//   // the very first item's balances are our current state.
//   const latest = transactions[0];
//   totals.bankBalance = latest.balances.bank;
//   totals.safeToSpend = latest.balances.safe;

//   // Calculate totals for pending items and categories
//   transactions.forEach((tx) => {
//     // 1. Sum up active IPO holds
//     if (tx.type === "IPO_HOLD" && tx.status === "PENDING") {
//       totals.totalLocked += tx.amount;
//     }

//     // 2. Sum up money lent that hasn't been returned
//     if (tx.type === "LENT" && tx.status === "PENDING") {
//       totals.totalLent += tx.amount;
//     }

//     // 3. Group spending by category for the Graph
//     if (tx.type === "SPEND") {
//       const cat = tx.category || "Other";
//       totals.categoryWise[cat] = (totals.categoryWise[cat] || 0) + tx.amount;
//     }
//   });

//   return totals;
// };
/**
 * Robust Calculator for ClearCash
 * Builds current state by summing all transactions to prevent "undefined" errors.
 */
export const calculateTotals = (transactions) => {
  let totals = {
    bankBalance: 0,
    safeToSpend: 0,
    totalLocked: 0, 
    totalLent: 0,   
    categoryWise: {},
  };

  if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
    return totals;
  }

  // 1. Sort by date (oldest first) to accurately build the running balance
  const sortedHistory = [...transactions].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  let runningBalance = 0;

  sortedHistory.forEach((tx) => {
    const amount = Number(tx.amount) || 0;

    // 2. Logic to build the balance based on transaction type
    if (tx.type === "INITIAL" || tx.type === "RECEIVED") {
      runningBalance += amount;
    } else if (tx.type === "SPEND" || tx.type === "IPO_HOLD" || tx.type === "LENT") {
      runningBalance -= amount;
    }

    // 3. Accumulate stats for the Bento Grid
    if (tx.type === "IPO_HOLD") {
      totals.totalLocked += amount;
    }
    if (tx.type === "LENT") {
      totals.totalLent += amount;
    }
    if (tx.type === "SPEND") {
      const cat = tx.category || "General";
      totals.categoryWise[cat] = (totals.categoryWise[cat] || 0) + amount;
    }
  });

  // Final mapping for the Hero Cards
  totals.bankBalance = runningBalance;
  totals.safeToSpend = runningBalance; // You can subtract totalLocked here if you want it to reflect true spending power

  return totals;
};