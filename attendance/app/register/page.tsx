"use client";
import { useState, useEffect } from "react";
import { addUser, encryptPassword } from "../api/endpoints";
import Link from "next/link";

export default function RegisterPage() {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [info, setInfo ] = useState({
      email: "",
      password: "",
      name: "",
      subjects: "",
  });

    const handleSubmit = async () => {
      try {
        setLoading(true);
        if(await addUser(info)) {
            alert("Profile created");
            setLoading(false);  
        } else {alert("Error creating profile"); setLoading(false);}
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
        
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInfo({
            ...info,
            [e.target.name]: e.target.name === "password" ? encryptPassword(e.target.value): e.target.value
        });
    }

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 w-80">
        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[100ms]" : "opacity-0"}`}>
          Email:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[200ms]" : "opacity-0"}`} type="text" name="email" onChange={handleChange}/>

        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[300ms]" : "opacity-0"}`}>
          Password:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[400ms]" : "opacity-0"}`}type="password" name="password" onChange={handleChange}/>

        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[300ms]" : "opacity-0"}`}>
          Name:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[400ms]" : "opacity-0"}`}type="text" name="name" onChange={handleChange}/>

        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[300ms]" : "opacity-0"}`}>
          Course:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[400ms]" : "opacity-0"}`}type="text" name="subjects" onChange={handleChange}/>

        {/* <Link href="/authenticationPages/loginPage"> */}
          <div className="mt-6 transition-all ease-in-out hover:-translate-y-1 hover:scale-105 duration-300 w-full">
            <button className={`mt-4 cursor-pointer shadow-xl bg-purple-800 transition-all ease-out duration-1000 w-full px-4 py-2 rounded-lg ${loaded ? "animate-fadeInUp delay-[600ms]" : "opacity-0"}`} type="submit" onClick={handleSubmit} disabled={loading}>
              Register
            </button>
          </div>
        {/* </Link> */}
      </div>
    </div>
  );
}
