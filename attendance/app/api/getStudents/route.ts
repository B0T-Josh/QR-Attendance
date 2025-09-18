import { NextResponse } from "next/server";
import { getStudent } from "../endpoints";

export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid method"}, {status: 400});
    const info = await req.json();
    const {data, error} = await getStudent({student_id: info.student_id, name: info.name, subjcts: info.subjects});
    if(data) {
        return NextResponse.json({data}, {status: 200});
    } else {
        return NextResponse.json({error}, {status: 400});
    }
}