import { NextResponse } from "next/server";
import { addStudent, getAllStudent, removeStudent } from "../endpoints";

// GET: fetch all students for a user
export async function GET() {
  const {data, error} = await getAllStudent();

  if (error) return NextResponse.json({ error: error }, { status: 400 });

  return NextResponse.json({ data }, {status: 200});
}

// POST: add a student
export async function POST(req: Request) {
  const data = await req.json();
  if (!data) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const {success, error} = await addStudent(data);

  if(success) {
    return NextResponse.json({success: success}, {status: 200});
  }

  return NextResponse.json({ error: error }, {status: 400});
}

// DELETE: remove a student
export async function DELETE(req: Request) {
  const {student_id, teacher_id} = await req.json();

  if (!student_id) {
    return NextResponse.json({ error: "Missing student_id or user_id" }, { status: 400 });
  }

  const {success, error} = await removeStudent(student_id, teacher_id);

  if (success) return NextResponse.json({ success: success }, { status: 200 });

  return NextResponse.json({ error: error }, {status: 400});
}
