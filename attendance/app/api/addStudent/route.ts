import { NextResponse } from "next/server";
import { addStudent, getAllStudent, removeStudent } from "../endpoints";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type Profile = {
  student_id: string | null;
  name: string | null;
  subjects: string[] | [];
}

// GET: fetch all students for a user
export async function GET() {
  const {data, error} = await getAllStudent();

  if (error) return NextResponse.json({ error: error }, { status: 400 });

  return NextResponse.json({ data }, {status: 200});
}

// POST: add a student
export async function POST(req: Request) {
  const store = await cookies();
  const token = store.get("token")?.value;
  
  if(!token) {
    return NextResponse.json({error: "Unauthorized user"}, {status: 401});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if(decoded) {
      const data: Profile[] = await req.json();
      if (!data) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
      }

      const {success, error} = await addStudent(data);

      if(success) {
        return NextResponse.json({success: success}, {status: 200});
      }

      return NextResponse.json({ error: error }, {status: 400});
    }
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

// DELETE: remove a student
export async function DELETE(req: Request) {
  const store = await cookies();
  const token = store.get("token")?.value;
  
  if(!token) {
    return NextResponse.json({error: "Unauthorized user"}, {status: 401});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if(decoded) {
      const {student_id} = await req.json();

      if (!student_id) {
        return NextResponse.json({ error: "Missing student_id or user_id" }, { status: 400 });
      }

      const {success, error} = await removeStudent(student_id);

      if (success) return NextResponse.json({ success: success }, { status: 200 });

      return NextResponse.json({ error: error }, {status: 400});
    }
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }  
}
