import { NextResponse } from "next/server";
import { addRecord } from "../endpoints"; // adjust path to your supabase client

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if(await addRecord(data)){
        return NextResponse.json({ success: `Record added for student ${data.name}`}, {status: 200});
    } else {
        return NextResponse.json({ error: "There is an error adding student record"}, {status: 401});
    }
  } catch (err) {
    alert(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
