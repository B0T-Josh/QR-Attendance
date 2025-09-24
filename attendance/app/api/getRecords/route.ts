import { NextResponse } from "next/server";
import { getRecords } from "../endpoints";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

//Connected to /api/requests/request/getRecords. Get attendance record depends on the user input
export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid Method"}, {status: 400});
    
    const store = await cookies();
    const token = store.get("token")?.value;
    
    if(!token) {
        return NextResponse.json({error: "Unauthorized user"}, {status: 401});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if(decoded) {
            
            const {subject} = await req.json();
            const {data, error} = await getRecords(subject);
            if(data) {
                return NextResponse.json({data: data}, {status: 200});
            } else {
                return NextResponse.json({error: error}, {status: 400});
            }
        }
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}