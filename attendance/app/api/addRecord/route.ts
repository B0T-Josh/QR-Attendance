import { NextResponse } from "next/server";
import { addRecord, checkDate, timeOut } from "../endpoints"; // adjust path to your supabase client

//Connected to /api/requests/request/scanned. This adds student records for the QR that was scanned from scanner.
export async function POST(req: Request) {
  try {
    //Gets the data that was submitted.
    const {student_id, subjects, name, teacher_id} = await req.json();
    //Check if date was existing for the student.
    if(await checkDate(student_id, subjects)){
      //If date is existing sets time out for the student
        if(await timeOut(student_id, subjects)) {
          return NextResponse.json({ success: `Time out added for student ${name}`}, {status: 200});
        } 
        return NextResponse.json({ error: `Already have time out for student ${name}`}, {status: 400});
    } 
    //If student doesn't have a record for the day, it sets a record for the student.
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
