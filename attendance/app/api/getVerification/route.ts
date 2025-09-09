import { NextResponse } from "next/server";
import { verificationFromUser } from "../endpoints"; // adjust path to your supabase client

export async function GET(req: Request) {
  try {
    const data: any = req.json();
    const res: any = await verificationFromUser(parseInt(data.id)) 
    return NextResponse.json({ message: "Value returned", verification: res.data });
  } catch (err) {
    alert(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
