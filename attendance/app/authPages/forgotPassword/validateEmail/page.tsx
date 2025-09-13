'use client';

import { useEffect, useState } from "react";
import encryptPassword from "@/components/encrypt";
import { validateCode } from "@/app/api/requests/request";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const route = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(encryptPassword(e.target.value));
  }

  async function handleSubmit() {
    const btn = document.getElementById("submit");
    if (btn) {
        btn.textContent = "Loading";
    }
    const { success, error } = await validateCode({code: code});
    if(success) {
      route.push("/authPages/forgotPassword/validateEmail/resetPassword");   
    } else{
      alert(`${error}`);
      location.reload();
    }
  }

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-80">
            <h1 className={`mb-4 transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[100ms]" : "opacity-0"}`}>
                Recovery code:
            </h1>
            <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[200ms]" : "opacity-0"}`} type="password" onChange={handleChange}/>

            <div className="transition-all ease-in-out hover:-translate-y-1 hover:scale-105 duration-300 w-full">
                  <button id="submit" className={`mt-4 cursor-pointer shadow-xl bg-purple-800 hover:bg-purple-600 transition-all ease-out duration-1000 w-full px-4 py-2 rounded-lg ${loaded ? "animate-fadeInUp delay-[600ms]" : "opacity-0"}`} type="submit" onClick={handleSubmit}>
                      Validate
                  </button>
            </div>
        </div>
    </div>
  );
}