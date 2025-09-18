import { NextResponse } from "next/server";
import { verifyStudentData } from "../endpoints";

//Connected to /api/requests/request/verifyStudentData.
export async function POST(req: Request) {
    //Checks the request method.
    if(req.method !== "POST") return NextResponse.json({error: "Invalid Method"}, {status: 400});
    //Gets the submitted data.
    const info = await req.json();
    //Gets the response of verifyStudent from endpoints.
    const {data, error} = await verifyStudentData(info);
    //If data exist, the student exist. Otherwise return an error message.
    if(data) {
        return NextResponse.json({data: data}, {status: 200});
    } else {
        return NextResponse.json({error: error}, {status: 400});
    }
}