import { NextResponse } from "next/server";
import { getAllSubjects } from "@/app/api/endpoints"

//Connected to /api/requests/request/getSubjects.
export async function POST(req: Request) {
    //Checks request method.
    if(req.method !== "POST") {
        return NextResponse.json({error: "Invalid method"});
    }
    //Gets the submitted data.
    const {id} = await req.json();
    //Gets the response.
    const data = await getAllSubjects(id);
    //If data not null, returns data. Otherwise returns a null value.
    if(data) {
        return NextResponse.json({data}, {status: 200});
    } else {
        return NextResponse.json({error: "There is an error fetching data"}, {status: 400});
    }
}