import { NextResponse } from "next/server";
import { addVerification } from "../endpoints"; // adjust path to your supabase client
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

//Connected to /components/Popup/submit. Adds verification for the user
export async function POST(req: Request) {
    if(req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    const store = await cookies();
    const token = store.get("token")?.value;
    
    if(!token) {
        return NextResponse.json({error: "Unauthorized user"}, {status: 401});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if(decoded) {
            const {verification, id} = await req.json();
            if(verification === null && id === null) {
                return NextResponse.json({ error: "No data provided" }, { status: 400 });
            }
            if(await addVerification(verification, id)) {
                return NextResponse.json({ success: "Verification added successfully. Please reload the page" }, { status: 200 });
            } else {
                return NextResponse.json({ error: "Failed to add Verification" }, { status: 401 });
            }
        }
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
}
