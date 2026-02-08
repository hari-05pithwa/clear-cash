import { TransactionModel } from "@/models/Transaction";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { initialBalance } = await request.json();

    // Basic validation to ensure we have a number
    if (!initialBalance || isNaN(initialBalance)) {
      return NextResponse.json({ error: "Invalid balance provided" }, { status: 400 });
    }

    // This creates the very first document in your Atlas 'transactions' collection
    await TransactionModel.create({
      amount: initialBalance,
      type: 'INITIAL',
      category: 'Setup',
      name: 'Opening Balance',
      note: 'Initial account sync'
    });

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Setup Error:", error);
    return NextResponse.json({ error: "Failed to connect to Atlas" }, { status: 500 });
  }
}