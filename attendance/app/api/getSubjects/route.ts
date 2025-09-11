import { NextResponse } from "next/server";
import { getAllSubjects } from "@/app/api/endpoints"

export async function POST(req: Request) {
    if(req.method !== "POST") {
        return NextResponse.json({error: "Invalid method"});
    }
    const info = await req.json();
    const data = await getAllSubjects(info);
    if(data) {
        return NextResponse.json({data}, {status: 200});
    } else {
        return NextResponse.json({error: "There is an error fetching data"}, {status: 400});
    }
}