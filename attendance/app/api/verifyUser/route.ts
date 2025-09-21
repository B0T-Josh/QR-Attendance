import { NextResponse } from "next/server";
import { validateTeacher } from "../endpoints";

//Connected to /api/requests/request/validateTeacher.
export async function POST(req: Request) {
    //Checks request method.
    if(req.method !== "POST") return NextResponse.json({error: "Invalid method"});
    //Gets the submitted data.
    const {uid} = await req.json();
    //Gets the ID of the user.
    const {id} = await validateTeacher(uid);
    //If id exist, means user is verified. 
    if(id) {
        return NextResponse.json({id: id}, {status: 200});
    } else {
        return NextResponse.json({error: "There is no user for this ID"}, {status: 400});
    }
}