'use client';

import { useEffect, useState } from "react";
import encryptPassword from "@/components/encrypt";
import { updatePassword } from "@/app/api/requests/request";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
    const route = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [password, setPassword] = useState({
        new: "",
        confirm: ""
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {name, value} = e.target
        setPassword((prev) => ({
            ...prev,
            [name]: encryptPassword(value)
        }));
    }

    async function handleSubmit() {
        document.getElementById("submit").textContent = "Loading";
        if(password.new === password.confirm){
            const { success, error } = await updatePassword({password: password.new, email: localStorage.getItem("email")});
            if(success) {
                alert(`${success}`);
                route.push("/authPages/login");
            } else {
                alert(`${error}`);
            }
        } else {
            alert("New password and confirm password, doesn't match");
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
                    Set a new password:
                </h1>
                <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[200ms]" : "opacity-0"}`} name="new" type="password" onChange={handleChange}/>

                <h1 className={`mb-4 transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[100ms]" : "opacity-0"}`}>
                    Confirm password:
                </h1>
                <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[200ms]" : "opacity-0"}`} name="confirm" type="password" onChange={handleChange}/>

                <div className="transition-all ease-in-out hover:-translate-y-1 hover:scale-105 duration-300 w-full">
                    <button id="submit" className={`mt-4 cursor-pointer shadow-xl bg-purple-800 hover:bg-purple-600 transition-all ease-out duration-1000 w-full px-4 py-2 rounded-lg ${loaded ? "animate-fadeInUp delay-[600ms]" : "opacity-0"}`} type="submit" onClick={handleSubmit}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}