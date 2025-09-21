import { NextResponse } from "next/server";
import { getStudent } from "../endpoints";
//Gets the student data and return response
export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid method"}, {status: 400});
    const {student_id, name, subjects} = await req.json();
    const {data, error} = await getStudent({student_id: student_id, name: name, subjects: subjects});
    if(data) {
        return NextResponse.json({data}, {status: 200});
    } else {
        return NextResponse.json({error}, {status: 400});
    }
}