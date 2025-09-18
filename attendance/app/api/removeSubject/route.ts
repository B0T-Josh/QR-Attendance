import { NextResponse } from "next/server";
import { removeSubject } from "../endpoints";

//Connected to /api/requests/request/handleRemoveSubject
export async function POST(req: Request) {
    //Check request method.
    if(req.method !== "POST") {
        return NextResponse.json({error: "Invalid request method"}, {status: 400});
    }
    //Gets the submitted data.
    const data = await req.json();
    //Removes the subject submitted. return message if successful. Otherwise return error message.
    if(await removeSubject(data)) {
        return NextResponse.json({message: "Subject is successfully removed"}, {status: 200});
    }
    return NextResponse.json({error: "Subject doesn't exist"}, {status: 400});
}