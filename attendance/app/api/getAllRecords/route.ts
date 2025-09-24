import { NextResponse } from "next/server";
import { getAllRecords } from "../endpoints";

//Get all records related to the teacher ID
export async function POST(req: Request) {
    const {teacher_id} = await req.json();
    const {data, error} = await getAllRecords(teacher_id);
    if(data) {
        return NextResponse.json({data: data}, {status: 200});
    } else if(error) {
        return NextResponse.json({error: error}, {status: 400});
    }
    return NextResponse.json({error: "Server error"}, {status: 500});
}