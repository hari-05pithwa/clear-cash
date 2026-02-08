import { TransactionModel } from "@/models/Transaction";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { newBalance } = await request.json();

    // We record this as a 'SYNC' type to update the baseline
    await TransactionModel.create({
      amount: newBalance,
      type: 'INITIAL', // Re-using INITIAL logic to reset the baseline
      category: 'Sync',
      name: 'Manual Balance Sync',
      note: 'Updated to match bank app'
    });

    return NextResponse.json({ message: "Balance Synced" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}