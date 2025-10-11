"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import encryptPassword from "@/tools/encrypt"
import { logIn, verifyUser } from "@/app/api/requests/request";

export default function LogIn() {
  const route = useRouter();
  const ranOnce = useRef(false);
  const [content, setContent] = useState<React.ReactElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  //Validates the ID of the user that was inside the localstorage
    useEffect(() => {
      if(ranOnce.current) return;
      ranOnce.current = true;
      async function validate() {
        const {data} = await verifyUser();
        if(data) {
          if (data.admin === "false") {
            if(data.success) {
              route.push("/dashboard/homePage");
            }
          } else if(data.admin === "true") {
            if(data.success) {
              route.push("/adminDashboard/manageStudent");
            }
          }
        }
      }
      validate();
      setLoaded(true);
    }, []);

  //Updates credential values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.name === "password" ? encryptPassword(e.target.value): e.target.value
    });
  };

  //Log in process
  const handleSubmit = async () => {
    setLoading(true);
    if(credentials.email && credentials.password) {
      const { data, error } = await logIn({email: credentials.email, password: credentials.password});
      if(data?.success) {
        if(data.admin) {
          route.push("/adminDashboard/manageStudent");
        } else {
          route.push("/dashboard/homePage");
        }
      } else {
        setContent(<p className="text-red-500">{error}</p>);
        setLoading(false);
      }
    } else {
      setContent(<p className="text-red-500">Enter an email account and password</p>);
      setLoading(false);
    }
  };
  //Resets the content value.
  useEffect(() => {
    if(!content) return;
    setTimeout(() => {
      setContent(null);
    }, 2000);
  }, [content]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loaded ? (
        <div className="space-y-4 w-80">
        {content}
        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[100ms]" : "opacity-0"}`}>
          Email:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[200ms]" : "opacity-0"}`} type="text" disabled={loading} onChange={handleChange} name="email" placeholder="example@gmail.com"/>

        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[300ms]" : "opacity-0"}`}>
          Password:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[400ms]" : "opacity-0"}`}type="password" disabled={loading} onChange={handleChange} name="password"/>

        <div className="flex justify-left">
          <Link href="/authPages/forgotPassword" className={`mb-2 transition-opacity ease-out duration-1000 text-purple-800 hover:text-purple-600 ${loaded ? "animate-fadeInUp delay-[500ms]" : "opacity-0"}`}>
            Forgot Password?
          </Link>
        </div>

        <div className="transition-all ease-in-out hover:-translate-y-1 hover:scale-105 duration-300 w-full">
          <button className={`cursor-pointer shadow-xl bg-purple-800 hover:bg-purple-600 transition-all ease-out duration-1000 w-full px-4 py-2 rounded-lg ${loaded ? "animate-fadeInUp delay-[600ms]" : "opacity-0"}`} id="submit" type="submit" onClick={handleSubmit} disabled={loading || !(credentials.email && credentials.password)}>
            {loading ? (<>Loading</>) : (<>Log In</>)} {/* Changes text value when a process is loading */}
          </button>
        </div>
        <h3 className={`mt-4 transition-opacity ease-out duration-1000 text-center text-gray-600 ${loaded ? "animate-fadeInUp delay-[500ms]" : "opacity-0"}`}>
          {"Don't have an account?"}
          <Link href="/authPages/register" className="ml-1 text-purple-800 hover:text-purple-600">
            Sign Up
          </Link>
        </h3>
      </div>
      ) : (<></>)}
    </div>
  );
}