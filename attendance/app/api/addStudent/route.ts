import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: fetch all students for a user
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", user_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ data });
}

// POST: add a student
export async function POST(req: Request) {
  const { student_id, name, subject, user_id } = await req.json();

  if (!student_id || !name || !subject || !user_id) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("students")
    .insert([{ student_id, name, subject, user_id }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: "Student added successfully" });
}

// DELETE: remove a student
export async function DELETE(req: Request) {
  const { student_id, user_id } = await req.json();

  if (!student_id || !user_id) {
    return NextResponse.json({ error: "Missing student_id or user_id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("students")
    .delete()
    .eq("student_id", student_id)
    .eq("user_id", user_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: "Student removed successfully" });
}
