import { NextResponse } from "next/server";
import { verifyCode } from "@/app/api/endpoints"

export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid method"});
    const data = await req.json();
    if(await verifyCode(data) > 0) {
        return NextResponse.json({success: "Recovery code match"}, {status: 200});
    }
    return NextResponse.json({error: "Recovery code does not match"}, {status: 400});
}