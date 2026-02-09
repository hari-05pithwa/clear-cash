import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    // Check both potential parameter names
    const identifier = searchParams.get("userId") || searchParams.get("id"); 

    if (!identifier) {
      return NextResponse.json({ error: "No identifier provided" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("clearcash");

    // Search for either the full vault_id OR the human-friendly alias
    const user = await db.collection("users").findOne({
      $or: [
        { userId: identifier },
        { alias: identifier.toLowerCase() }
      ]
    });

    if (!user) {
      return NextResponse.json({ error: "Vault not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("clearcash");

  await db.collection("users").updateOne(
    { userId: body.userId },
    { 
      $set: { 
        firstName: body.firstName, 
        lastName: body.lastName,
        alias: body.alias?.toLowerCase() // Save the easy name
      } 
    },
    { upsert: true }
  );
  return NextResponse.json({ success: true });
}