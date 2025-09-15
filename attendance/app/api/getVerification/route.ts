import { NextResponse } from "next/server";
import { getVerification } from "../endpoints"; // adjust path to your supabase client

export async function POST(req: Request) {
  try {
    const data: any = await req.json();
    const { verification, error } = await getVerification(data.id)
    if(verification) {
      return NextResponse.json({ message: "Value returned", verification: verification }, {status: 200});
    } else {
      return NextResponse.json({ error: error }, {status: 400});
    }
  } catch (error) {
    return NextResponse.json({ error: error }, {status: 500});
  }
}
