import { NextResponse } from "next/server";
import { addRecord, checkDate, timeOut } from "../endpoints"; // adjust path to your supabase client

//Connected to /api/requests/request/scanned. This adds student records for the QR that was scanned from scanner.
export async function POST(req: Request) {
  try {
    //Gets the data that was submitted.
    const data = await req.json();
    //Check if date was existing for the student.
    if(await checkDate(data)){
      //If date is existing sets time out for the student
        if(await timeOut(data)) {
          return NextResponse.json({ success: `Time out added for student ${data.name}`}, {status: 200});
        } 
        return NextResponse.json({ error: `Already have time out for student ${data.name}`}, {status: 400});
    } 
    //If student doesn't have a record for the day, it sets a record for the student.
    const { success, error } = await addRecord(data);
    if(success){
      return NextResponse.json({ success: success}, {status: 200});
    } else {
      return NextResponse.json({ error: error}, {status: 400});
    }
  } catch (err) {
    alert(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
