import { NextResponse } from "next/server";
import { addStudent, getAllStudent, removeStudent } from "../endpoints";

// GET: fetch all students for a user
export async function GET() {
  const {data, error} = await getAllStudent();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ data }, {status: 200});
}

// POST: add a student
export async function POST(req: Request) {
  const data = await req.json();
  if (!data) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const {success, error} = await addStudent({student_id: data.student_id, name: data.name, subjects: data.subjects});

  if(success) {
    return NextResponse.json({success: success}, {status: 200});
  }

  return NextResponse.json({ error: error }, {status: 400});
}

// DELETE: remove a student
export async function DELETE(req: Request) {
  const data = await req.json();

  if (!data.student_id) {
    return NextResponse.json({ error: "Missing student_id or user_id" }, { status: 400 });
  }

  const {success, error} = await removeStudent({student_id: data.student_id});

  if (success) return NextResponse.json({ success: success }, { status: 200 });

  return NextResponse.json({ error: error }, {status: 400});
}
