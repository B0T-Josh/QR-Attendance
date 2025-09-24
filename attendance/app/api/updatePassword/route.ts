import { NextResponse } from "next/server";
import { updatePassword } from "../endpoints"; // adjust path to your supabase client

//Connected to /api/requests/request/updatePassword. Update the password of the user
export async function POST(req: Request) {
    if(req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    const {password, email} = await req.json();
    if((password && email) === null) {
        return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }
    if(await updatePassword(password, email)) {
        return NextResponse.json({ success: "Password updated" }, { status: 200 });
    } else {
        return NextResponse.json({ error: "Failed to updated password" }, { status: 401 });
    }
}
