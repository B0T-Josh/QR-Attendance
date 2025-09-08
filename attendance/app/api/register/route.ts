import { NextResponse } from "next/server";
import { addUser } from "../endpoints"; // adjust path to your supabase client

export async function POST(req: Request) {
    if(req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    const data = await req.json();
    if(data === null) {
        return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }
    if(await addUser(data)) {
        return NextResponse.json({ message: "User added successfully" }, { status: 200 });
    } else {
        return NextResponse.json({ error: "Failed to create a profile" }, { status: 401 });
    }
}
