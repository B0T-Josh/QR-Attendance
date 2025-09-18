import { NextResponse } from "next/server";
import { addSubjects } from "../endpoints";

//Connected to /api/requests/request/handleAddSubject. Adds the subject that the user submitted.
export async function POST(req: Request) {
    //Check request method.
    if(req.method !== "POST") {
        return NextResponse.json({error: "Invalid request method"}, {status: 400});
    }
    //Gets the data.
    const data = await req.json();
    //Adds subject to the database
    if(await addSubjects({id: data.id, name: data.name})) {
        return NextResponse.json({message: "Subject is successfully added"}, {status: 200});
    }
    //Return error message when subject already existed.
    return NextResponse.json({error: "Subject already exist"}, {status: 400});
}