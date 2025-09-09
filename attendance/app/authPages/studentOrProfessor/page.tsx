"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

export default function StudentOrProfessor() {
    const [loaded, setLoaded] = useState(false);

      useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className={`relative text-lg md:text-2xl font-semibold text-center top-24 md:top-12 transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[100ms]" : "opacity-0"}`}>
                Are you a Student or a Professor?
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-24 h-screen transition-all">
                <div className={`flex flex-col items-center gap-8 transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[100ms]" : "opacity-0"}`}>
                    <Link href={"/studentDashboard/generateQR"}>
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            height="216px" 
                            viewBox="0 -960 960 960" 
                            width="216px" 
                            fill="#e3e3e3"
                            className="w-32 h-32 md:w-52 md:h-52 transition-all duration-500 ease-in-out hover:fill-purple-700 hover:-translate-y-2"
                            >
                                <path d="M480-242q-67 0-129 23.5T235-149v9h490v-9q-54-46-116-69.5T480-242Zm0-60q74 0 139.5 24.5T740-211v-609H220v609q55-42 120.5-66.5T480-302Zm2-139q-32.5 0-55.25-22.75T404-519q0-32.5 22.75-55.25T482-597q32.5 0 55.25 22.75T560-519q0 32.5-22.75 55.25T482-441ZM220-80q-24 0-42-18t-18-42v-680q0-24 18-42t42-18h520q24 0 42 18t18 42v680q0 24-18 42t-42 18H220Zm262-301q58 0 98-40t40-98q0-58-40-98t-98-40q-58 0-98 40t-40 98q0 58 40 98t98 40Zm-2-138Z"/>
                        </svg>
                    </Link>

                    <h1 className="text-xl font-bold">Student</h1>
                </div>

                <div className={`flex flex-col items-center gap-8 transition-opacity ease-out duration-1000 ${loaded ? "animate-fadeInUp delay-[100ms]" : "opacity-0"}`}>
                    <Link href={"/authPages/login"}>
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            height="216px" 
                            viewBox="0 -960 960 960"
                            width="216px" 
                            fill="#e3e3e3"
                            className="w-32 h-32 md:w-52 md:h-52 transition-all duration-500 ease-in-out hover:fill-purple-700 hover:-translate-y-2"
                            >
                                <path d="M860-131v-649H100v320H40v-320q0-25 17.63-42.5Q75.25-840 100-840h760q24.75 0 42.38 17.62Q920-804.75 920-780v580q0 26-17 45.5T860-131ZM360-401q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42Zm0-60q39 0 64.5-25.5T450-551q0-39-25.5-64.5T360-641q-39 0-64.5 25.5T270-551q0 39 25.5 64.5T360-461ZM40-80v-94q0-38 19-65t49-41q67-30 128.5-45T360-340q62 0 123 15.5t127.92 44.69q31.3 14.13 50.19 40.97Q680-212 680-174v94H40Zm60-60h520v-34q0-16-9.5-30.5T587-226q-64-31-117-42.5T360-280q-57 0-111 11.5T132-226q-14 7-23 21.5t-9 30.5v34Zm260-411Zm0 411Z"/>
                        </svg>
                    </Link>

                    <h1 className="text-xl font-bold">Professor</h1>
                </div>
            </div>
        </div>
    );
}