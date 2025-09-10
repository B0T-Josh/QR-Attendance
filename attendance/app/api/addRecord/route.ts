import { NextResponse } from "next/server";
import { addRecord, checkDate, timeOut } from "../endpoints"; // adjust path to your supabase client

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if(await checkDate(data)){
        if(await timeOut(data)) {
          return NextResponse.json({ success: `Time out added for student ${data.name}`}, {status: 200});
        } 
        return NextResponse.json({ error: `Already have time out for student ${data.name}`}, {status: 400});
    } 
    if(await addRecord(data)){
      return NextResponse.json({ success: `Record added for student ${data.name}`}, {status: 200});
    } else {
      return NextResponse.json({ error: `There is an error adding record for ${data.name}`}, {status: 400});
    }
  } catch (err) {
    alert(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
