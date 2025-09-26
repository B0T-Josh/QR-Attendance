import { NextResponse } from "next/server";
import { addRecord, checkDate, timeOut } from "../endpoints"; // adjust path to your supabase client
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

//Connected to /api/requests/request/scanned. This adds student records for the QR that was scanned from scanner.
export async function POST(req: Request) {
  const store = await cookies();
  const token = store.get("token")?.value;
  if(!token) {
    return NextResponse.json({error: "Unauthorized user"}, {status: 401});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if(decoded) {
      const {student_id, subjects, name} = await req.json();
      if(await checkDate(student_id, subjects)){
          if(await timeOut(student_id, subjects)) {
            return NextResponse.json({ success: `Time out added for student ${name}`}, {status: 200});
          } 
          return NextResponse.json({ error: `Already have time out for student ${name}`}, {status: 200});
      } 
      const { success, error } = await addRecord(student_id, subjects, name);
      if(success){
        return NextResponse.json({ success: success}, {status: 200});
      } else {
        return NextResponse.json({ error: error}, {status: 400});
      }
    }
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
