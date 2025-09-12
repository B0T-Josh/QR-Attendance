import { NextResponse } from "next/server";
import { removeSubject } from "../endpoints";

export async function POST(req: Request) {
    if(req.method !== "POST") {
        return NextResponse.json({error: "Invalid request method"}, {status: 400});
    }
    const data = await req.json();
    if(await removeSubject(data)) {
        return NextResponse.json({message: "Subject is successfully removed"}, {status: 200});
    }
    return NextResponse.json({error: "Subject doesn't exist"}, {status: 400});
}