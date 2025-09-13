import { NextResponse } from "next/server";
import { login } from "../endpoints";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { data, error } = await login({email: email, password: password});

    if (error || !data) {
      return NextResponse.json({ error: error || "Authentication failed" }, { status: 401 });
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
