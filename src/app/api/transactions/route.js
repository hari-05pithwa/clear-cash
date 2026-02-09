// import { TransactionModel } from "@/models/Transaction";
// import { NextResponse } from "next/server";

// // GET: Fetch all transactions for the Timeline
// export async function GET() {
//   try {
//     const transactions = await TransactionModel.getHistory();
//     return NextResponse.json(transactions, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
//   }
// }

// // POST: Save a new Petrol, IPO, or Lent entry
// export async function POST(request) {
//   try {
//     const data = await request.json();
    
//     // We use the Model we built to handle the balance math automatically
//     const result = await TransactionModel.create({
//       amount: data.amount,
//       type: data.type,         // 'SPEND', 'LENT', 'RECEIVED', 'IPO_HOLD'
//       category: data.category, // 'Food', 'Petrol', etc.
//       name: data.name,
//       note: data.note
//     });

//     return NextResponse.json(result, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to save transaction" }, { status: 500 });
//   }
// }



//ai
// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const client = await clientPromise;
//     const db = client.db("clearcash");

//     // Fetch ONLY transactions belonging to this specific user
//     const transactions = await db.collection("transactions")
//       .find({ userId })
//       .sort({ timestamp: -1 })
//       .toArray();

//     return NextResponse.json(transactions);
//   } catch (e) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }






//ai2
// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";

// // --- GET: Fetch user-specific transactions ---
// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const client = await clientPromise;
//     const db = client.db("clearcash");

//     const transactions = await db.collection("transactions")
//       .find({ userId })
//       .sort({ timestamp: -1 })
//       .toArray();

//     return NextResponse.json(transactions);
//   } catch (e) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

// // --- POST: Create a new user-specific transaction ---
// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { userId, name, amount, type, category } = body;

//     if (!userId) {
//       return NextResponse.json({ error: "User ID Required" }, { status: 400 });
//     }

//     const client = await clientPromise;
//     const db = client.db("clearcash");

//     const newTransaction = {
//       userId,
//       name,
//       amount: Number(amount),
//       type,
//       category,
//       timestamp: new Date(),
//       status: (type === "IPO_HOLD" || type === "LENT") ? "PENDING" : "COMPLETED"
//     };

//     const result = await db.collection("transactions").insertOne(newTransaction);
//     return NextResponse.json({ success: true, id: result.insertedId });
//   } catch (e) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }















// ai3
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET: Fetch user transactions
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db("clearcash");
    const transactions = await db.collection("transactions")
      .find({ userId })
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json(transactions);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST: Create new transaction
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, name, amount, type, category } = body;
    if (!userId) return NextResponse.json({ error: "User ID Required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("clearcash");
    const newTransaction = {
      userId,
      name,
      amount: Number(amount),
      type,
      category,
      timestamp: new Date(),
      status: (type === "IPO_HOLD" || type === "LENT") ? "PENDING" : "COMPLETED"
    };

    const result = await db.collection("transactions").insertOne(newTransaction);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT: Handle Allotment or Release of IPO Hold
export async function PUT(req) {
  try {
    const { transactionId, action, name } = await req.json();
    const client = await clientPromise;
    const db = client.db("clearcash");

    if (action === "RELEASED") {
      // If not allotted, delete the hold to restore Safe to Spend balance
      await db.collection("transactions").deleteOne({ _id: new ObjectId(transactionId) });
      return NextResponse.json({ success: true });
    }

    if (action === "ALLOTTED") {
      // If allotted, convert HOLD to a SPEND (finally deducting from Bank Balance)
      await db.collection("transactions").updateOne(
        { _id: new ObjectId(transactionId) },
        { 
          $set: { 
            type: "SPEND", 
            category: "IPO", 
            status: "COMPLETED",
            name: `Allotted: ${name}`
          } 
        }
      );
      return NextResponse.json({ success: true });
    }
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}