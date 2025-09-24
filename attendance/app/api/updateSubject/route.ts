import { NextResponse } from "next/server";
import { updateSubjectForStudent } from "../endpoints";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

//Updates the subject for a student.
export async function POST(req: Request) {
    if(req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 404 });
    }
    
    const token = (await cookies()).get("token")?.value;
    if(!token) {
        return NextResponse.json({error: "Unauthorized user"}, {status: 401});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if(decoded) {
            const {student_id, teacher_id, subjects} = await req.json();

            if(student_id && teacher_id && subjects) {
                const {success, error} = await updateSubjectForStudent(student_id, teacher_id, subjects);
                if(success) {
                    return NextResponse.json({success: success}, {status: 200});
                } else if(error) {
                    return NextResponse.json({error: error}, {status: 400});
                }
                return NextResponse.json({error: "Server error"}, {status: 500});
            } else {
                return NextResponse.json({error: "No data was received"}, {status: 400});
            }
        }
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
