import { NextResponse } from "next/server";
import { updateSubjectForStudent } from "../endpoints";

export async function POST(req: Request) {
    //Checks the request method.
    if(req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 404 });
    }
    //Gets the submitted data.
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
