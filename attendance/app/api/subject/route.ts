import { NextResponse } from "next/server";
import { removeSubject, addSubjects } from "../endpoints";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


//Adds subject for the teacher.
export async function POST(req: Request) {
    const token = (await cookies()).get("token")?.value;
    if(!token) {
        return NextResponse.json({error: "Unauthorized user"}, {status: 401});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if(decoded) {
            const {id, subjects} = await req.json();
            if(await addSubjects(id, subjects)) {
                return NextResponse.json({message: "Subject is successfully added"}, {status: 200});
            }
            return NextResponse.json({error: "Subject already exist"}, {status: 400});
        }
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}

//Connected to /api/requests/request/handleRemoveSubject. Remove a subject of a user
export async function DELETE(req: Request) {
    if(req.method !== "DELETE") return NextResponse.json({error: "Invalid Method"}, {status: 400});

    const store = await cookies();
    const token = store.get("token")?.value;

    if(!token) {
        return NextResponse.json({error: "Unauthorized user"}, {status: 401});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if(decoded) {
            const {id, subjects} = await req.json();
            if(await removeSubject(id, subjects)) {
                return NextResponse.json({message: "Subject is successfully removed"}, {status: 200});
            }
            return NextResponse.json({error: "Subject doesn't exist"}, {status: 400});
        }
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}