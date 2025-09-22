import { NextResponse } from "next/server";
import { getAllRecords } from "../endpoints";

export async function GET(req: Request) {
    const {data, error} = await getAllRecords();
    if(data) {
        return NextResponse.json({data: data}, {status: 200});
    } else if(error) {
        return NextResponse.json({error: error}, {status: 400});
    }
    return NextResponse.json({error: "Server error"}, {status: 500});
}