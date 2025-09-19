import { NextResponse } from "next/server";
import { login } from "../endpoints";

//Connected to /api/requests/request/login.
export async function POST(req: Request) {
  //Checks request method.
  if(req.method !== "POST") return NextResponse.json({error: "Invalid Method"}, {status: 400});
  try {
    //Gets the data submitted
    const { email, password } = await req.json();
    //Gets the login response.
    const { data, error } = await login({email: email, password: password});
    //If error or data = null, returns an error response.
    if (error || !data) {
      return NextResponse.json({ error: error || "Authentication failed" }, { status: 401 });
    }
    //If data.password not equals to the password submitted, returns an error message.
    if (parseInt(data.password) !== parseInt(password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    //If password is validated, returns the ID of the user.
    return NextResponse.json({ id: data.id }, { status: 200 });
    //Catches server side error.
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
