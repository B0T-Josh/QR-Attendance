"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  
import encryptPassword from "@/tools/encrypt"
import Link from "next/link";
import { register } from "@/app/api/requests/request";

export default function RegisterPage() {
  const route = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [content, setContent] = useState<any>();
  const [loading, setLoading] = useState(false);
  const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
  const [info, setInfo ] = useState({
      email: "",
      password: null,
      name: null,
  });
  const [password, setPassword] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      if(info.email && info.password && info.name && password) {
        if(emailRegex.test(info.email)) {
          if(password === info.password) {
            setLoading(true);
            const { success, error } = await register({email: info.email, password: info.password, name: info.name});
            if(success) {
              route.push("/authPages/login");
            } else {
              setContent(<p className="text-red-500">{error}</p>);
              setLoading(false);
              setTimeout(() => {
                setContent("");
              }, 1500);
            }
          } else {
            setContent(<p className="text-red-500">Password and Confirm password doesn't match</p>);
            setTimeout(() => {
              setContent("");
            }, 1500);
          }
        } else {
          setContent(<p className="text-red-500">Enter valid email account</p>);
          setTimeout(() => {
            setContent("");
          }, 1500);
        }
      } else {
        setContent(<p className="text-red-500">Enter an email account and password</p>);
        setTimeout(() => {
          setContent("");
        }, 1500);
      }
      
    } catch (error) {
      alert("Profile creation unsuccessful");
      console.log(error);
    }
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setInfo({
          ...info,
          [e.target.name]: e.target.name === "password" ? encryptPassword(e.target.value): e.target.value
      });
  };

  function handleConfirm(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(encryptPassword(e.target.value));
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
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[200ms]" : "opacity-0"}`} type="text" name="email" onChange={handleChange} placeholder="example@gmail.com"/>

        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[300ms]" : "opacity-0"}`}>
          Password:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[400ms]" : "opacity-0"}`}type="password" name="password" onChange={handleChange}/>
        
        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[300ms]" : "opacity-0"}`}>
          Confirm Password:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[400ms]" : "opacity-0"}`}type="password" name="confirm" onChange={handleConfirm}/>

        <h1 className={`transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[300ms]" : "opacity-0"}`}>
          Name:
        </h1>
        <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[400ms]" : "opacity-0"}`}type="text" name="name" onChange={handleChange} placeholder="SURNAME, Firstname M.I."/>

        <div className="mt-6 transition-all ease-in-out hover:-translate-y-1 hover:scale-105 duration-300 w-full">
          <button className={`mt-4 cursor-pointer shadow-xl bg-purple-800 transition-all ease-out duration-1000 w-full px-4 py-2 rounded-lg ${loaded ? "animate-fadeInUp delay-[600ms]" : "opacity-0"}`} id="submit" type="submit" onClick={handleSubmit} disabled={loading}>
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
