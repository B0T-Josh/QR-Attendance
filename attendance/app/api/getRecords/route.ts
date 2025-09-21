import { NextResponse } from "next/server";
import { getRecords } from "../endpoints";

//Connected to /api/requests/request/getRecords.
export async function POST(req: Request) {
    //Checks the request method.
    if(req.method !== "POST") return NextResponse.json({error: "Invalid Method"}, {status: 400});
    //Gets the submitted data.
    const {student_id, name, subjects, date} = await req.json();
    //Gets the response from getRecords.
    const {data, error} = await getRecords({student_id: student_id, name: name, subjects: subjects}, date);
    //If data is not null, returns data. Otherwise, returns an error message.
    if(data) {
        return NextResponse.json({data: data}, {status: 200});
    } else {
        return NextResponse.json({error: error}, {status: 400});
    }
}