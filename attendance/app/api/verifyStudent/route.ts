import { NextResponse } from "next/server";
import { verifyStudent } from "../endpoints";

//Connected to /api/requests/request/verifyStudentData. Verify if the student exist.
export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid Method"}, {status: 400});
    const {student_id, teacher_id} = await req.json();
    const {exist, empty} = await verifyStudent(student_id, teacher_id);
    if(exist) {
        return NextResponse.json({exist: exist}, {status: 200});
    } else {
        return NextResponse.json({empty: empty}, {status: 200});
    }
}