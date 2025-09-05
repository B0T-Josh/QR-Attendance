"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { addUser, addTeacher, addSubject } from "../api/endpoints";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [info, setInfo ] = useState({
        email: "",
        password: "",
        name: "",
        subjects: "",
    });

    const handleSubmit = async () => {
        setLoading(true);
        if(await addUser(supabase, info)) {
            alert("Profile created");
            setLoading(false);  
        } else {alert("Error creating profile"); setLoading(false);}
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInfo({
            ...info,
            [e.target.name]: e.target.value
        });
    }

    return(
        <div className="p-4">
        <input
            type="text"
            name="email"
            placeholder="email"
            value={info.email}
            onChange={handleChange}
            className="border p-2 mr-2"
        />
        <input
            type="password"
            name="password"
            placeholder="password"
            value={info.password}
            onChange={handleChange}
            className="border p-2 mr-2"
        />
        <input
            type="text"
            name="name"
            placeholder="Name"
            value={info.name}
            onChange={handleChange}
            className="border p-2 mr-2"
        />
        <input
            type="text"
            name="subjects"
            placeholder="Subject(s)"
            value={info.subjects}
            onChange={handleChange}
            className="border p-2 mr-2"
        />
        <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2"
        >
            Add Profile
        </button>
        <br />
        <br />
        <br />
        <br />
        <p>{loading ? "Loading" : ""}</p>
    </div>
    );
}
