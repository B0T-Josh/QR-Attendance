"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function LogIn() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 w-80">
        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[100ms]" : "opacity-0"}`}>
          Email:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[200ms]" : "opacity-0"}`} type="text"/>

        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[300ms]" : "opacity-0"}`}>
          Password:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[400ms]" : "opacity-0"}`}type="password"/>

        <div className="flex justify-end">
          <Link href="/auth/forgot-password" className={`mb-2 transition-opacity ease-out duration-1000 text-purple-800 hover:text-purple-600 ${loaded ? "animate-fadeInUp delay-[500ms]" : "opacity-0"}`}>
            Forgot Password?
          </Link>
        </div>

        <Link href="/dashboard">
          <div className="transition-all ease-in-out hover:-translate-y-1 hover:scale-105 duration-300 w-full">
            <button className={`cursor-pointer shadow-xl bg-purple-800 hover:bg-purple-600 transition-all ease-out duration-1000 w-full px-4 py-2 rounded-lg ${loaded ? "animate-fadeInUp delay-[600ms]" : "opacity-0"}`}>
              Log In
            </button>
          </div>
        </Link>

        <h3 className={`mt-4 transition-opacity ease-out duration-1000 text-center text-gray-600 ${loaded ? "animate-fadeInUp delay-[500ms]" : "opacity-0"}`}>
          Don't have an account? 
          <Link href="/register" className="ml-1 text-purple-800 hover:text-purple-600">
            Sign Up
          </Link>
        </h3>
      </div>
    </div>
  );
}