import { NextResponse } from "next/server";
import { removeSubject, addSubjects } from "../endpoints";

export async function POST(req: Request) {
    //Gets the data.
    const data = await req.json();
    //Adds subject to the database
    if(await addSubjects({id: data.id, name: data.name})) {
        return NextResponse.json({message: "Subject is successfully added"}, {status: 200});
    }
    //Return error message when subject already existed.
    return NextResponse.json({error: "Subject already exist"}, {status: 400});
}

//Connected to /api/requests/request/handleRemoveSubject
export async function DELETE(req: Request) {
    //Gets the submitted data.
    const data = await req.json();
    //Removes the subject submitted. return message if successful. Otherwise return error message.
    if(await removeSubject(data)) {
        return NextResponse.json({message: "Subject is successfully removed"}, {status: 200});
    }
    return NextResponse.json({error: "Subject doesn't exist"}, {status: 400});
}