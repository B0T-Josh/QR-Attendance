import { NextResponse } from "next/server";
import { getAllSubjects } from "@/app/api/endpoints"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

//Connected to /api/requests/request/getSubjects. Get all subject for the teacher
export async function POST(req: Request) {
    if(req.method !== "POST") {
        return NextResponse.json({error: "Invalid method"});
    }
    
    const store = await cookies();
    const token = store.get("token")?.value;
    
    if(!token) {
        return NextResponse.json({error: "Unauthorized user"}, {status: 401});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if(decoded) {
            const {id} = await req.json();
            const data = await getAllSubjects(id);
            if(data) {
                return NextResponse.json({data}, {status: 200});
            } else {
                return NextResponse.json({error: "There is an error fetching data"}, {status: 400});
            }
        }
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}