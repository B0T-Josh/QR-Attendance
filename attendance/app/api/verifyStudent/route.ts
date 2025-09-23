import { NextResponse } from "next/server";
import { verifyStudent } from "../endpoints";

//Connected to /api/requests/request/verifyStudentData.
export async function POST(req: Request) {
    //Checks the request method.
    if(req.method !== "POST") return NextResponse.json({error: "Invalid Method"}, {status: 400});
    //Gets the submitted data.
    const {student_id, teacher_id} = await req.json();
    //Gets the response of verifyStudent from endpoints.
    const {exist, empty} = await verifyStudent(student_id, teacher_id);
    //If data exist, the student exist. Otherwise return an error message.
    if(exist) {
        return NextResponse.json({exist: exist}, {status: 200});
    } else {
        return NextResponse.json({empty: empty}, {status: 200});
    }
}