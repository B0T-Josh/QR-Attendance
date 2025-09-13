"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import encryptPassword from "@/components/encrypt"
import { logIn } from "@/app/api/requests/request";

export default function LogIn() {
  const route = useRouter();
  const [content, setContent] = useState<any>();
  const [loaded, setLoaded] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    setLoaded(true);
    if(!(localStorage.getItem("id") == null || localStorage.getItem("id") == undefined)) {
      route.push("/dashboard/addRemoveSubject");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.name === "password" ? encryptPassword(e.target.value): e.target.value
    });
  };

  const handleSubmit = async () => {
    const btn = document.getElementById("submit");
    if (btn) {
        btn.textContent = "Loading";
    }
    const { id, error } = await logIn({email: credentials.email, password: credentials.password});
    if(id) {
      localStorage.setItem("id", id);
      route.push("/dashboard/homePage");
    } else {
      setContent(<p className="text-red-500">Invalid email or password...</p>)
      setTimeout(() => {
        location.reload();
      }, 1500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 w-80">
        {content}
        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[100ms]" : "opacity-0"}`}>
          Email:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[200ms]" : "opacity-0"}`} type="text" onChange={handleChange} name="email" placeholder="example@gmail.com"/>

        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[300ms]" : "opacity-0"}`}>
          Password:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[400ms]" : "opacity-0"}`}type="password" onChange={handleChange} name="password"/>

        <div className="flex justify-end">
          <Link href="/authPages/forgotPassword" className={`mb-2 transition-opacity ease-out duration-1000 text-purple-800 hover:text-purple-600 ${loaded ? "animate-fadeInUp delay-[500ms]" : "opacity-0"}`}>
            Forgot Password?
          </Link>
        </div>

        <div className="transition-all ease-in-out hover:-translate-y-1 hover:scale-105 duration-300 w-full">
          <button className={`cursor-pointer shadow-xl bg-purple-800 hover:bg-purple-600 transition-all ease-out duration-1000 w-full px-4 py-2 rounded-lg ${loaded ? "animate-fadeInUp delay-[600ms]" : "opacity-0"}`} id="submit" type="submit" onClick={handleSubmit}>
            Log In
          </button>
        </div>
        <h3 className={`mt-4 transition-opacity ease-out duration-1000 text-center text-gray-600 ${loaded ? "animate-fadeInUp delay-[500ms]" : "opacity-0"}`}>
          Don't have an account? 
          <Link href="/authPages/register" className="ml-1 text-purple-800 hover:text-purple-600">
            Sign Up
          </Link>
        </h3>
      </div>
    </div>
  );
}