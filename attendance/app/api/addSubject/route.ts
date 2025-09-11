import { NextResponse } from "next/server";
import { addSubjects } from "../endpoints";

export async function POST(req: Request) {
    if(req.method !== "POST") {
        return NextResponse.json({error: "Invalid request method"}, {status: 400});
    }
    const data = await req.json();
    if(await addSubjects({id: data.id, name: data.name})) {
        return NextResponse.json({message: "Subject is successfully added"}, {status: 200});
    }
    return NextResponse.json({error: "Subject already exist"}, {status: 400});
}