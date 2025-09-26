import { NextResponse } from "next/server";
import { getStudentByTeacherSubject } from "../endpoints";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

//Gets the student data and return response
export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid method"}, {status: 400});
    
    const store = await cookies();
    const token = store.get("token")?.value;
    
    if(!token) {
        return NextResponse.json({error: "Unauthorized user"}, {status: 401});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if(decoded) {
            const {subjects} = await req.json();
            const {data, error} = await getStudentByTeacherSubject(subjects);
            console.log(data);
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