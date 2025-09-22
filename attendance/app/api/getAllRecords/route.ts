import { NextResponse } from "next/server";
import { getAllRecords } from "../endpoints";
type Subject = {
    name: string | null;
}

export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid request method"}, {status: 400});
    const info: Subject[] = await req.json();
    if(info) {
        const {data, error} = await getAllRecords(info);
        if(data) {
            return NextResponse.json({data: data}, {status: 200});
        } else if(error) {
            return NextResponse.json({error: error}, {status: 400});
        } else {
            return NextResponse.json({error: "Server error"}, {status: 500});
        }
    } else {
        return NextResponse.json({error: "Empty request data"}, {status: 400});
    }
}