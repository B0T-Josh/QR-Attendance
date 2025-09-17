import { NextResponse } from "next/server";
import { getRecords } from "../endpoints";

export async function POST(req: Request) {
    if(req.method !== "POST") return NextResponse.json({error: "Invalid Method"}, {status: 400});
    const info = await req.json();
    const {data, error} = await getRecords({data: info.data});
    if(data) {
        return NextResponse.json({data: data});
    } else {
        return NextResponse.json({error: error});
    }
}