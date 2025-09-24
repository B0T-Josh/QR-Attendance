import { NextResponse } from "next/server";
import { getRecords } from "../endpoints";

//Connected to /api/requests/request/getRecords. Get attendance record depends on the user input
export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid Method"}, {status: 400});
    const {subject} = await req.json();
    const {data, error} = await getRecords(subject);
    if(data) {
        return NextResponse.json({data: data}, {status: 200});
    } else {
        return NextResponse.json({error: error}, {status: 400});
    }
}