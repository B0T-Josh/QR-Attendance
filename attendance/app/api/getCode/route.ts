import { NextResponse } from "next/server";
import { verifyCode } from "@/app/api/endpoints"

//Connected to /api/requests/request/verifyCode. check if the verification code matches for hte account
export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid method"});
    const {code, email} = await req.json();
    if(await verifyCode(code, email) > 0) {
        return NextResponse.json({success: "Recovery code match"}, {status: 200});
    }
    return NextResponse.json({error: "Recovery code does not match"}, {status: 400});
}