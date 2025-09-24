import { NextResponse } from "next/server";
import { getEmail } from "@/app/api/endpoints"

//Connected to /api/requests/request/validateEmail. Validates if the email exist
export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid method"});
    const {email} = await req.json();
    if(await getEmail(email) > 0) {
        return NextResponse.json({success: "Email account exist"}, {status: 200});
    }
    return NextResponse.json({error: "Email address invalid"}, {status: 400});
}