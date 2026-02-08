/**
 * Calculates current status from a list of transactions
 * Useful for the Dashboard and Analytics pages.
 */
export const calculateTotals = (transactions) => {
  let totals = {
    bankBalance: 0,
    safeToSpend: 0,
    totalLocked: 0, // IPOs
    totalLent: 0,   // Money given to others
    categoryWise: {},
  };

  if (!transactions || transactions.length === 0) return totals;

  // Since transactions are sorted by newest first, 
  // the very first item's balances are our current state.
  const latest = transactions[0];
  totals.bankBalance = latest.balances.bank;
  totals.safeToSpend = latest.balances.safe;

  // Calculate totals for pending items and categories
  transactions.forEach((tx) => {
    // 1. Sum up active IPO holds
    if (tx.type === "IPO_HOLD" && tx.status === "PENDING") {
      totals.totalLocked += tx.amount;
    }

    // 2. Sum up money lent that hasn't been returned
    if (tx.type === "LENT" && tx.status === "PENDING") {
      totals.totalLent += tx.amount;
    }

    // 3. Group spending by category for the Graph
    if (tx.type === "SPEND") {
      const cat = tx.category || "Other";
      totals.categoryWise[cat] = (totals.categoryWise[cat] || 0) + tx.amount;
    }
  });

  return totals;
};