"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
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

        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[300ms]" : "opacity-0"}`}>
          Name:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[400ms]" : "opacity-0"}`}type="text"/>

        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[300ms]" : "opacity-0"}`}>
          Course:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[400ms]" : "opacity-0"}`}type="text"/>

        <Link href="/authenticationPages/loginPage">
          <div className="mt-6 transition-all ease-in-out hover:-translate-y-1 hover:scale-105 duration-300 w-full">
            <button className={`mt-4 cursor-pointer shadow-xl bg-purple-800 transition-all ease-out duration-1000 w-full px-4 py-2 rounded-lg ${loaded ? "animate-fadeInUp delay-[600ms]" : "opacity-0"}`}>
              Register
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
