import { NextResponse } from "next/server";
import { updatePassword } from "../endpoints"; // adjust path to your supabase client

export async function POST(req: Request) {
    if(req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    const data: any = await req.json();
    if(data === null) {
        return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }
    if(await updatePassword({password: data.password, email: data.email})) {
        return NextResponse.json({ success: "Password updated" }, { status: 200 });
    } else {
        return NextResponse.json({ error: "Failed to updated password" }, { status: 401 });
    }
}
