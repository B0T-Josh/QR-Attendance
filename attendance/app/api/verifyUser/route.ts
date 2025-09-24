import { NextResponse } from "next/server";
import { validateTeacher } from "../endpoints";

//Connected to /api/requests/request/validateTeacher. Validate if the user exist.
export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid method"});
    const {uid} = await req.json();
    const {exist} = await validateTeacher(uid);
    if(exist) {
        return NextResponse.json({exist: exist}, {status: 200});
    } else {
        return NextResponse.json({error: "There is no user for this ID"}, {status: 200});
    }
}