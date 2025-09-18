import { NextResponse } from "next/server";
import { verifyStudentData } from "../endpoints";

export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid Method"}, {status: 400});
    const info = await req.json();
    const {data, error} = await verifyStudentData(info);
    if(data) {
        return NextResponse.json({data: data}, {status: 200});
    } else {
        return NextResponse.json({error: error}, {status: 400});
    }
}