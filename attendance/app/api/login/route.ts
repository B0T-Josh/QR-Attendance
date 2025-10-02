import { NextResponse } from "next/server";
import { login } from "../endpoints";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

//Connected to /api/requests/request/login. Logs in the user.
export async function POST(req: Request) {
  if(req.method !== "POST") return NextResponse.json({error: "Invalid Method"}, {status: 400});
  try {
    const {email, password} = await req.json();
    const { data, error } = await login(email, password);
    if (error || !data) {
      return NextResponse.json({ error: error || "Authentication failed" }, { status: 401 });
    }
    if (parseInt(data.password) !== parseInt(password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      {email, role: "professor"},
      process.env.JWT_SECRET!,
      {expiresIn: "1d"}
    )

    const cookie = await cookies();
    cookie.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 day
    });

    cookie.set("id", data.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 day
    });

    cookie.set("admin", data.admin ? "true" : "false", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, //1 day
    })
    
    return NextResponse.json({data: { success: true, admin: data.admin }}, {status: 200});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
