import { NextResponse } from "next/server";
import { getStudentByTeacherID } from "../endpoints";

//Gets the student data and return response
export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid method"}, {status: 400});
    const {teacher_id} = await req.json();
    const {data, error} = await getStudentByTeacherID(teacher_id);
    if(data) {
        return NextResponse.json({data}, {status: 200});
    } else {
        return NextResponse.json({error}, {status: 400});
    }
}