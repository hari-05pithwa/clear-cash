// import { TransactionModel } from "@/models/Transaction";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const { initialBalance } = await request.json();

//     // Basic validation to ensure we have a number
//     if (!initialBalance || isNaN(initialBalance)) {
//       return NextResponse.json({ error: "Invalid balance provided" }, { status: 400 });
//     }

//     // This creates the very first document in your Atlas 'transactions' collection
//     await TransactionModel.create({
//       amount: initialBalance,
//       type: 'INITIAL',
//       category: 'Setup',
//       name: 'Opening Balance',
//       note: 'Initial account sync'
//     });

//     return NextResponse.json({ message: "Success" }, { status: 200 });
//   } catch (error) {
//     console.error("Setup Error:", error);
//     return NextResponse.json({ error: "Failed to connect to Atlas" }, { status: 500 });
//   }
// }




//ai
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { userId, firstName, lastName, initialBalance } = await req.json();
    const client = await clientPromise;
    const db = client.db("clearcash");

    // 1. Save user profile details
    await db.collection("users").insertOne({
      userId,
      firstName,
      lastName,
      createdAt: new Date()
    });

    // 2. Record the initial balance as the first transaction for THIS user
    await db.collection("transactions").insertOne({
      userId, // Crucial for device separation
      name: "Initial Balance",
      amount: initialBalance,
      type: "INITIAL",
      category: "System",
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}