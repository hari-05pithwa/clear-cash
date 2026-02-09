// import clientPromise from "@/lib/mongodb";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const client = await clientPromise;
//     const db = client.db("clearcash");

//     // MongoDB Aggregation: Group by category and sum the amounts
//     const stats = await db.collection("transactions").aggregate([
//       { $match: { type: "SPEND" } }, // Only look at spending
//       {
//         $group: {
//           _id: "$category",
//           total: { $sum: "$amount" }
//         }
//       },
//       { $sort: { total: -1 } } // Highest spending first
//     ]).toArray();

//     return NextResponse.json(stats, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to get insights" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const range = searchParams.get("range") || "alltime";

    // SECURITY: Block requests without a specific User ID
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: User ID Required" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("clearcash");

    // DATE FILTERING: Calculate the window
    let startDate = new Date(0); // Beginning of time
    const now = new Date();

    if (range === "thisweek") {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (range === "thismonth") {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // AGGREGATION: Match the specific User, the type 'SPEND', and the Date
    const stats = await db.collection("transactions").aggregate([
      { 
        $match: { 
          userId: userId,           // <--- THIS FIXES THE DATA LEAKAGE
          type: "SPEND", 
          timestamp: { $gte: startDate } 
        } 
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } }
    ]).toArray();

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Aggregation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}