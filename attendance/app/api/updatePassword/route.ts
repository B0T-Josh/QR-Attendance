import { NextResponse } from "next/server";
import { updatePassword } from "../endpoints"; // adjust path to your supabase client

//Connected to /api/requests/request/updatePassword
export async function POST(req: Request) {
    //Checks the request method.
    if(req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    //Gets the submitted data.
    const {password, email} = await req.json();
    //If data is null, returns error message.
    if((password && email) === null) {
        return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }
    //Updates the password submitted by the user to the database.
    if(await updatePassword(password, email)) {
        return NextResponse.json({ success: "Password updated" }, { status: 200 });
    } else {
        return NextResponse.json({ error: "Failed to updated password" }, { status: 401 });
    }
}
