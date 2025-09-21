import { NextResponse } from "next/server";
import { addVerification } from "../endpoints"; // adjust path to your supabase client

//Connected to /components/Popup/submit
export async function POST(req: Request) {
    //Checks request method.
    if(req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    //Gets the submitted data.
    const {verification, id} = await req.json();
    //If data is null, returns an error message.
    if(verification === null && id === null) {
        return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }
    //Adds verification code for the user. 
    if(await addVerification(verification, id)) {
        return NextResponse.json({ success: "Verification added successfully. Please reload the page" }, { status: 200 });
    } else {
        return NextResponse.json({ error: "Failed to add Verification" }, { status: 401 });
    }
}
