import { NextResponse } from "next/server";
import { getEmail } from "@/app/api/endpoints"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

//Connected to /api/requests/request/validateEmail. Validates if the email exist
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
            
            const {email} = await req.json();
            if(await getEmail(email) > 0) {
                return NextResponse.json({success: "Email account exist"}, {status: 200});
            }
            return NextResponse.json({error: "Email address invalid"}, {status: 400});
        }
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}