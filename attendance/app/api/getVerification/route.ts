import { NextResponse } from "next/server";
import { getVerification } from "../endpoints"; // adjust path to your supabase client
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

//Connected to /api/requests/request/getValidation. Checks if the verification exist for the user.
export async function POST(req: Request) {
  if(req.method !== "POST") return NextResponse.json({error: "Invalid Method"}, {status: 400});
  
  const token = (await cookies()).get("token")?.value;
  if(!token) {
      return NextResponse.json({error: "Unauthorized user"}, {status: 401});
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      if(decoded) {
          try {
            const {id} = await req.json();
            const { verification, error } = await getVerification(id)
            if(verification) {
              return NextResponse.json({ message: "Value returned" }, {status: 200});
            } else {
              return NextResponse.json({ error: error }, {status: 400});
            }
          } catch (error) {
            return NextResponse.json({ error: error }, {status: 500});
          }
      }
  } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
