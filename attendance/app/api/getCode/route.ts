import { NextResponse } from "next/server";
import { verifyCode } from "@/app/api/endpoints"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

//Connected to /api/requests/request/verifyCode. check if the verification code matches for hte account
export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid method"});
    
    const store = await cookies();
    const token = store.get("token")?.value;

    if(!token) {
        return NextResponse.json({error: "Unauthorized user"}, {status: 401});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if(decoded) {
            
            const {code, email} = await req.json();
            if(await verifyCode(code, email) > 0) {
                return NextResponse.json({success: "Recovery code match"}, {status: 200});
            }
            return NextResponse.json({error: "Recovery code does not match"}, {status: 400});
        }
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}