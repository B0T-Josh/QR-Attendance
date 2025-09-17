import { NextResponse } from "next/server";
import { validateTeacher } from "../endpoints";

export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid method"});
    const data = await req.json();
    const {id, error} = await validateTeacher({id: data.id});
    if(id) {
        return NextResponse.json({id: id}, {status: 200});
    } else {
        return NextResponse.json({error: "There is no user for this ID"}, {status: 400});
    }
}