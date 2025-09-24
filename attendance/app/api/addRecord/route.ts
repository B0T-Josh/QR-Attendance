import { NextResponse } from "next/server";
import { addRecord, checkDate, timeOut } from "../endpoints"; // adjust path to your supabase client

//Connected to /api/requests/request/scanned. This adds student records for the QR that was scanned from scanner.
export async function POST(req: Request) {
  try {
    const {student_id, subjects, name, teacher_id} = await req.json();
    if(await checkDate(student_id, subjects)){
        if(await timeOut(student_id, subjects)) {
          return NextResponse.json({ success: `Time out added for student ${name}`}, {status: 200});
        } 
        return NextResponse.json({ error: `Already have time out for student ${name}`}, {status: 200});
    } 
    const { success, error } = await addRecord(student_id, subjects, name, teacher_id);
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
