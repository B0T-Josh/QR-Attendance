import { NextResponse } from "next/server";
import { verifyStudent } from "../endpoints";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

//Connected to /api/requests/request/verifyStudentData. Verify if the student exist.
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
            const {student_id} = await req.json();
            const {exist, empty} = await verifyStudent(student_id);
            if(exist) {
                return NextResponse.json({exist: exist}, {status: 200});
            } else {
                return NextResponse.json({empty: empty}, {status: 200});
            }
        }
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}