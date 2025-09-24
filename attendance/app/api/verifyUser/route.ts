import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
    const store = await cookies();
    const token = store.get("token")?.value;

    if (!token) return NextResponse.json({error: "Unauthorized user"}, {status: 401});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if (decoded) {
            const id = store.get("id")?.value;
            return NextResponse.json({success: id}, {status: 201});
        }
        store.delete("token");
        store.delete("id");
        return NextResponse.json({error: "Invalid token"}, {status: 401});
    } catch {
    return NextResponse.json({error: "Unauthorized user"}, {status: 401});
    }
}