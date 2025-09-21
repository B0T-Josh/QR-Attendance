"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";  
import encryptPassword from "@/tools/encrypt"
import Link from "next/link";
import { register } from "@/app/api/requests/request";
import format from "@/tools/format";

export default function RegisterPage() {
  const route = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [content, setContent] = useState<React.ReactElement | null>(null);
  const [loading, setLoading] = useState(false);
  const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
  const [info, setInfo ] = useState({
      email: "",
      password: "",
      name: "",
  });
  const [password, setPassword] = useState<string | null>(null);
  const typeTimeout = useRef<NodeJS.Timeout | null>(null);

  //Process registation
  const handleSubmit = async () => {
    try {
      if(info.email && info.password && info.name && password) {
        if(emailRegex.test(info.email)) {
          if(password === info.password) {
            setLoading(true);
            const data = await register({email: info.email, password: info.password, name: info.name});
            if(data.success) {
              route.push("/authPages/login");
            } else {
              setContent(<p className="text-red-500">{data.error}</p>);
              setLoading(false);
            }
          } else {
            setContent(<p className="text-red-500">Password and Confirm password doesn't match</p>);
          }
        } else {
          setContent(<p className="text-red-500">Enter valid email account</p>);

        }
      } else {
        setContent(<p className="text-red-500">Enter an email account and password</p>);
      }
    } catch (error) {
      alert("Profile creation unsuccessful");
      console.log(error);
    }
  };

  //Clears content
  useEffect(() => {
    if(!content) return;
    setTimeout(() => {
      setContent(null);
    }, 2500);
  }, [content])

  //Apply changes from input fields
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    //Set debounces. Waits for the user to be done typing
      if(typeTimeout.current) {
        clearTimeout(typeTimeout.current);
      }
      typeTimeout.current = setTimeout(() => {
        setInfo({
          ...info,
          [e.target.name]: e.target.name === "password" ? String(encryptPassword(e.target.value)): e.target.value
        });
      }, 500);
  };

  //Changes email value
  function handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setInfo({
      ...info,
      email: e.target.value
    })
  };

  //Format name after user types
  function handleName(e: React.ChangeEvent<HTMLInputElement>) {
    if(typeTimeout.current) {
      clearTimeout(typeTimeout.current);
    }
    typeTimeout.current = setTimeout(() => {
      const formatted = format(e.target.value);
      if(formatted?.formatted) {
        setInfo({
        ...info,
          name: formatted.formatted,
        });
      } else {
        setContent(<p className="text-red-500">{formatted?.error}</p>);
        setTimeout(() => {
          setContent(<></>);
        }, 2000);
      }
    }, 500);
  };

  //Set confirm password value
  function handleConfirm(e: React.ChangeEvent<HTMLInputElement>) {
    if(typeTimeout.current) {
      clearTimeout(typeTimeout.current);
    }
    typeTimeout.current = setTimeout(() => {
      setPassword(String(encryptPassword(e.target.value)));
    }, 500);
  }

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 w-80">
        {content}
        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[100ms]" : "opacity-0"}`}>
          Email:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[200ms]" : "opacity-0"}`} disabled={loading} type="text" name="email" onChange={handleEmail} placeholder="example@gmail.com"/>

        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[300ms]" : "opacity-0"}`}>
          Password:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[400ms]" : "opacity-0"}`} disabled={loading} type="password" name="password" onChange={handleChange}/>
        
        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[300ms]" : "opacity-0"}`}>
          Confirm Password:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[400ms]" : "opacity-0"}`} disabled={loading} type="password" name="confirm" onChange={handleConfirm}/>

        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[300ms]" : "opacity-0"}`}>
          Name:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[400ms]" : "opacity-0"}`} disabled={loading} type="text" name="name" onChange={handleName} placeholder="SURNAME, Firstname M.I."/>

        <div className="mt-6 transition-all ease-in-out hover:-translate-y-1 hover:scale-105 duration-300 w-full">
          <button className={`mt-4 cursor-pointer shadow-xl bg-purple-800 transition-all ease-out duration-1000 w-full px-4 py-2 rounded-lg ${loaded ? "animate-fadeInUp delay-[600ms]" : "opacity-0"}`} disabled={loading || !(info.email !== "" && info.name !== "" && info.password !== "")} id="submit" type="submit" onClick={handleSubmit}>
            {loading ? (<>Loading</>) : (<>Register</>)}
          </button>
        </div>

        <h3 className={`mt-4 transition-opacity ease-out duration-1000 text-center text-gray-600 ${loaded ? "animate-fadeInUp delay-[500ms]" : "opacity-0"}`}>
          Already have an account? 
          <Link href="/authPages/login" className="ml-1 text-purple-800 hover:text-purple-600">
            Sign In
          </Link>
        </h3>
      </div>
    </div>
  );
}
