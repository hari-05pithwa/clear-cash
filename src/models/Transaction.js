import clientPromise from "@/lib/mongodb";

export const TransactionModel = {
  async create(data) {
    const client = await clientPromise;
    const db = client.db("clearcash");
    
    // 1. Get the most recent transaction to find the current balance
    const lastTx = await db.collection("transactions")
      .find()
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    // If no transactions exist, start at 0
    const lastBankBal = lastTx.length > 0 ? lastTx[0].balances.bank : 0;
    const lastSafeBal = lastTx.length > 0 ? lastTx[0].balances.safe : 0;

    const amount = Number(data.amount);

    // 2. Prepare the new transaction document
    const newTx = {
      amount: amount,
      type: data.type, // 'SPEND', 'LENT', 'RECEIVED', 'IPO_HOLD', 'INITIAL'
      category: data.category || 'General',
      name: data.name,
      note: data.note || "",
      status: (data.type === 'LENT' || data.type === 'IPO_HOLD') ? 'PENDING' : 'COMPLETED',
      timestamp: new Date(),
      balances: {
        // Logic: 
        // RECEIVED or INITIAL adds money to bank
        // IPO_HOLD doesn't change bank balance (money is just blocked)
        // Everything else subtracts from bank
        bank: (data.type === 'RECEIVED' || data.type === 'INITIAL') ? lastBankBal + amount : 
              data.type === 'IPO_HOLD' ? lastBankBal : lastBankBal - amount,
        
        // Safe balance drops for everything except RECEIVED or INITIAL
        safe: (data.type === 'RECEIVED' || data.type === 'INITIAL') ? lastSafeBal + amount : lastSafeBal - amount
      }
    };

    return await db.collection("transactions").insertOne(newTx);
  },

  async getHistory(limit = 50) {
    const client = await clientPromise;
    const db = client.db("clearcash");
    return await db.collection("transactions")
      .find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }
};