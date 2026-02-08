import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("clearcash");

    // MongoDB Aggregation: Group by category and sum the amounts
    const stats = await db.collection("transactions").aggregate([
      { $match: { type: "SPEND" } }, // Only look at spending
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } } // Highest spending first
    ]).toArray();

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get insights" }, { status: 500 });
  }
}