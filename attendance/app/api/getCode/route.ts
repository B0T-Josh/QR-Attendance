import { NextResponse } from "next/server";
import { verifyCode } from "@/app/api/endpoints"

//Connected to /api/requests/request/verifyCode
export async function POST(req: Request) {
    //Checks the request method.
    if(req.method !== "POST") return NextResponse.json({error: "Invalid method"});
    //Gets the data submitted.
    const {code, email} = await req.json();
    //Verify the output of verifyCode if greater than 0.
    if(await verifyCode(code, email) > 0) {
        return NextResponse.json({success: "Recovery code match"}, {status: 200});
    }
    //If less than or equal to 0, return an error message.
    return NextResponse.json({error: "Recovery code does not match"}, {status: 400});
}