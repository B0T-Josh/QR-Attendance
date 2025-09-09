import { NextResponse } from "next/server";
import { addVerification } from "../endpoints"; // adjust path to your supabase client

export async function POST(req: Request) {
    if(req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    const data: any = await req.json();
    if(data === null) {
        return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }
    if(await addVerification({verification: data.verification, id: data.id})) {
        return NextResponse.json({ message: "Verification added successfully" }, { status: 200 });
    } else {
        return NextResponse.json({ error: "Failed to add Verification" }, { status: 401 });
    }
}
