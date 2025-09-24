import { NextResponse } from "next/server";
import { removeSubject, addSubjects } from "../endpoints";

//Adds subject for the teacher.
export async function POST(req: Request) {
    const {id, subjects} = await req.json();
    if(await addSubjects(id, subjects)) {
        return NextResponse.json({message: "Subject is successfully added"}, {status: 200});
    }
    return NextResponse.json({error: "Subject already exist"}, {status: 400});
}

//Connected to /api/requests/request/handleRemoveSubject. Remove a subject of a user
export async function DELETE(req: Request) {
    const {id, subjects} = await req.json();
    if(await removeSubject(id, subjects)) {
        return NextResponse.json({message: "Subject is successfully removed"}, {status: 200});
    }
    return NextResponse.json({error: "Subject doesn't exist"}, {status: 400});
}