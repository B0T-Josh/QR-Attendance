import { NextResponse } from "next/server";
import { getEmail } from "@/app/api/endpoints"

//Connected to /api/requests/request/validateEmail.
export async function POST(req: Request) {
    //Checks the request method.
    if(req.method !== "POST") return NextResponse.json({error: "Invalid method"});
    //Gets the data submitted.
    const {email} = await req.json();
    //Checks if the email account exist.
    if(await getEmail(email) > 0) {
        return NextResponse.json({success: "Email account exist"}, {status: 200});
    }
    //If not, return an error message.
    return NextResponse.json({error: "Email address invalid"}, {status: 400});
}