import { NextResponse } from "next/server";
import { getVerification } from "../endpoints"; // adjust path to your supabase client

//Connected to /api/requests/request/getValidation
export async function POST(req: Request) {
  if(req.method !== "POST") return NextResponse.json({error: "Invalid Method"}, {status: 400});
  try {
    //Gets the submitted data.
    const data: any = await req.json();
    //Gets the data from getVerification.
    const { verification, error } = await getVerification(data.id)
    //If verification is not null, return a message. Otherwise return an error message.
    if(verification) {
      return NextResponse.json({ message: "Value returned" }, {status: 200});
    } else {
      return NextResponse.json({ error: error }, {status: 400});
    }
    //Catches server error.
  } catch (error) {
    return NextResponse.json({ error: error }, {status: 500});
  }
}
