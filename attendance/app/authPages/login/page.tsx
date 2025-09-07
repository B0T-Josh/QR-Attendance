"use client";

/* test */

/* test leon */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function encryptPassword(password: string) {
  let asciiArray = password.split("").map((char: string) => char.charCodeAt(0));
  let hashedPass = asciiArray.join("");
  return hashedPass;
}

export default function LogIn() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.name === "password" ? encryptPassword(e.target.value): e.target.value
    });
  };

  const handleSubmit = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {  'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if(response.ok) {
      const data = await response.json();
      localStorage.setItem('id', data.id);
      router.push('/dashboard');
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 w-80">
        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[100ms]" : "opacity-0"}`}>
          Email:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[200ms]" : "opacity-0"}`} type="text" onChange={handleChange} name="email" placeholder="example@gmail.com"/>

        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[300ms]" : "opacity-0"}`}>
          Password:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[400ms]" : "opacity-0"}`}type="password" onChange={handleChange} name="password"/>

        <div className="flex justify-end">
          <Link href="/auth/forgot-password" className={`mb-2 transition-opacity ease-out duration-1000 text-purple-800 hover:text-purple-600 ${loaded ? "animate-fadeInUp delay-[500ms]" : "opacity-0"}`}>
            Forgot Password?
          </Link>
        </div>

        <div className="transition-all ease-in-out hover:-translate-y-1 hover:scale-105 duration-300 w-full">
          <button className={`cursor-pointer shadow-xl bg-purple-800 hover:bg-purple-600 transition-all ease-out duration-1000 w-full px-4 py-2 rounded-lg ${loaded ? "animate-fadeInUp delay-[600ms]" : "opacity-0"}`} type="submit" onClick={handleSubmit}>
            makati burat ni aldrin
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