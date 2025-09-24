import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const cookie = await cookies();
    cookie.set("token", "", {
        expires: new Date(0), // expired immediately
        path: "/",
    });
    return NextResponse.json({ success: "Logged out" }, {status: 200});
}