import { NextResponse } from "next/server";
import { getAllRecords } from "../endpoints";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

//Get all records related to the teacher ID
export async function POST(req: Request) {
    const token = (await cookies()).get("token")?.value;
    if(!token) {
        return NextResponse.json({error: "Unauthorized user"}, {status: 401});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if(decoded) {
            const {teacher_id} = await req.json();
            const {data, error} = await getAllRecords(teacher_id);
            if(data) {
                return NextResponse.json({data: data}, {status: 200});
            } else if(error) {
                return NextResponse.json({error: error}, {status: 400});
            }
            return NextResponse.json({error: "Server error"}, {status: 500});
        }
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}