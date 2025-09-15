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

    const {success, error} = await addUser(data);

    if(success) {
        return NextResponse.json({ success: success }, { status: 200 });
    } else {
        return NextResponse.json({ error: error }, { status: 401 });
    }
}
