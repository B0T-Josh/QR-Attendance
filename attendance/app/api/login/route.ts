import { NextResponse } from "next/server";
import { supabase } from "../endpoints"; // adjust path to your supabase client

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { data, error } = await supabase
      .from("account")
      .select("id, password")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Authentication failed" }, { status: 401 });
    }

    if (data.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ id: data.id }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
