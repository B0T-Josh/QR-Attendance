'use client';

import { useEffect, useState } from "react";
import encryptPassword from "@/tools/encrypt";
import { updatePassword } from "@/app/api/requests/request";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
    const route = useRouter();
    const [content, setContent] = useState<React.ReactElement | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState({
        new: "",
        confirm: ""
    });

    //Sets encrypted password value
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {name, value} = e.target
        setPassword((prev) => ({
            ...prev,
            [name]: encryptPassword(value)
        }));
    }

    //Updates password for the user
    async function handleSubmit() {
        setLoading(true);
        if(password.new && password.confirm) {
            if(password.new === password.confirm){
                const { success, error } = await updatePassword({password: password.new, email: localStorage.getItem("email")});
                if(success) {
                    route.push("/authPages/login");
                } else {
                    setLoading(false);
                    setContent(<p className="text-red-500">{error}</p>);
                    setTimeout(() => {
                        setContent(null);
                    }, 1500);
                }
            } else {
                setContent(<p className="text-red-500">{"New password doesn't match Confirm password"}</p>);
                setTimeout(() => {
                    setContent(null);
                }, 1500);
            }
        } else {
            setContent(<p className="text-red-500">Enter a new password and confirm password</p>);
            setTimeout(() => {
                setContent(null);
            }, 1500);
        }
    }

    //Checks the localStorage for the email. If not existing, pushes back to the forgot password page.
    useEffect(() => {
        if(localStorage.getItem("email")) {
            setLoaded(true);
        } else {
            route.push("/authPages/forgotPassword");
        }
    }, []);
    
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="space-y-4 w-80">
                {content}
                <h1 className={`mb-4 transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[100ms]" : "opacity-0"}`}>
                    Set a new password:
                </h1>
                <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[200ms]" : "opacity-0"}`} name="new" type="password" onChange={handleChange}/>

                <h1 className={`mb-4 transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[100ms]" : "opacity-0"}`}>
                    Confirm password:
                </h1>
                <input className={`shadow-xl bg-zinc-800 transition-opacity ease-out duration-1000 w-full px-4 py-2 rounded-lg focus:outline-none ${loaded ? "animate-fadeInUp delay-[200ms]" : "opacity-0"}`} name="confirm" type="password" onChange={handleChange}/>

                <div className="transition-all ease-in-out hover:-translate-y-1 hover:scale-105 duration-300 w-full">
                    <button disabled={loading} id="submit" className={`mt-4 cursor-pointer shadow-xl bg-purple-800 hover:bg-purple-600 transition-all ease-out duration-1000 w-full px-4 py-2 rounded-lg ${loaded ? "animate-fadeInUp delay-[600ms]" : "opacity-0"}`} type="submit" onClick={handleSubmit}>
                        {loading ? (<>Loading</>) : (<>Next</>)} {/* Changes text value when a process is loading */}
                    </button>
                </div>
            </div>
        </div>
    );
}