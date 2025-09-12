import { NextResponse } from "next/server";
import { verificationFromUser } from "../endpoints"; // adjust path to your supabase client

export async function POST(req: Request) {
  try {
    const data: any = await req.json();
    const res: any = await verificationFromUser(parseInt(data.id))
    return NextResponse.json({ message: "Value returned", verification: res.verification }, {status: 200});
  } catch (error) {
    return NextResponse.json({ error: `${error}` }, {status: 500});
  }
}
