import { NextResponse } from "next/server";
import { getVerification } from "../endpoints"; // adjust path to your supabase client

//Connected to /api/requests/request/getValidation. Checks if the verification exist for the user.
export async function POST(req: Request) {
  if(req.method !== "POST") return NextResponse.json({error: "Invalid Method"}, {status: 400});
  try {
    const {id} = await req.json();
    const { verification, error } = await getVerification(id)
    if(verification) {
      return NextResponse.json({ message: "Value returned" }, {status: 200});
    } else {
      return NextResponse.json({ error: error }, {status: 400});
    }
  } catch (error) {
    return NextResponse.json({ error: error }, {status: 500});
  }
}
