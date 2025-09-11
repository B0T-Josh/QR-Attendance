import { NextResponse } from "next/server";
import { getEmail } from "@/app/api/endpoints"

export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid method"});
    const data = await req.json();
    if(await getEmail(data) > 0) {
        return NextResponse.json({success: "Email code match"});
    }
    return NextResponse.json({error: "Email code does not match"});
}