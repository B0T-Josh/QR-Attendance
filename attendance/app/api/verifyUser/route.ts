import { NextResponse } from "next/server";
import { validateTeacher } from "../endpoints";

export async function POST(req: Request) {
    if(req.method === "POST") return NextResponse.json({error: "Invalid method"});
    const {id, error} = await req.json();
    if(id) {
        return NextResponse.json({id: id}, {status: 200});
    } else {
        return NextResponse.json({error: error}, {status: 400});
    }
}