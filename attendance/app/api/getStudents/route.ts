import { NextResponse } from "next/server";
import { getStudentByTeacherID } from "../endpoints";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

//Gets the student data and return response
export async function POST(req: Request) {
    const token = (await cookies()).get("token")?.value;
    if(!token) {
        return NextResponse.json({error: "Unauthorized user"}, {status: 401});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if(decoded) {
            if(req.method !== "POST") return NextResponse.json({error: "Invalid method"}, {status: 400});
            const {teacher_id} = await req.json();
            const {data, error} = await getStudentByTeacherID(teacher_id);
            if(data) {
                return NextResponse.json({data}, {status: 200});
            } else {
                return NextResponse.json({error}, {status: 400});
            }
        }
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}