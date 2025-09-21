import { NextResponse } from "next/server";
import { addUser } from "../endpoints"; // adjust path to your supabase client

type Account = {
    email: string | null;
    password: string | null;
    name: string | null;
}

//Connected to /api/requests/request/addUser
export async function POST(req: Request) {
    //Checks the request method.
    if(req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    //Gets the submitted data.
    const data: Account = await req.json();
    //If data equals to null, return an error message.
    if(data === null) {
        return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }
    //Gets the response of addUser method.
    const {success, error} = await addUser(data);
    //If success returns a success message. Otherwise return an error message.
    if(success) {
        return NextResponse.json({ success: success }, { status: 200 });
    } else {
        return NextResponse.json({ error: error }, { status: 401 });
    }
}
