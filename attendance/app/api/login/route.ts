import { NextResponse } from "next/server";
import { login } from "../endpoints";

type Account = {
  email: string;
  password: string;
}

//Connected to /api/requests/request/login. Logs in the user.
export async function POST(req: Request) {
  if(req.method !== "POST") return NextResponse.json({error: "Invalid Method"}, {status: 400});
  try {
    const creds: Account = await req.json();
    const { data, error } = await login({name: "", id: "", email: creds.email, password: creds.password});
    if (error || !data) {
      return NextResponse.json({ error: error || "Authentication failed" }, { status: 401 });
    }
    if (parseInt(data.password) !== parseInt(creds.password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    return NextResponse.json({ id: data.id }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
