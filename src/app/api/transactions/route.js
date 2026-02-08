import { TransactionModel } from "@/models/Transaction";
import { NextResponse } from "next/server";

// GET: Fetch all transactions for the Timeline
export async function GET() {
  try {
    const transactions = await TransactionModel.getHistory();
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// POST: Save a new Petrol, IPO, or Lent entry
export async function POST(request) {
  try {
    const data = await request.json();
    
    // We use the Model we built to handle the balance math automatically
    const result = await TransactionModel.create({
      amount: data.amount,
      type: data.type,         // 'SPEND', 'LENT', 'RECEIVED', 'IPO_HOLD'
      category: data.category, // 'Food', 'Petrol', etc.
      name: data.name,
      note: data.note
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save transaction" }, { status: 500 });
  }
}