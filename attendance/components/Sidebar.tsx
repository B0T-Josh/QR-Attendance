'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Sidebar() {
    const route = useRouter();
    const [expanded, setExpanded] = useState(false);

    function handleLogOut() {
        localStorage.removeItem("id");
        if(localStorage.getItem("email")) {
            localStorage.removeItem("email");
            route.push("/authPages/login");
        }
        route.push("/authPages/login");
    }

  return (
    <div className="flex min-h-screen">
        <div className={`bg-purple-900 text-white h-screen transition-all duration-300 flex flex-col ${expanded ? "w-32" : "w-24"}`} onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)}>
            <div className="flex items-center justify-center flex-col gap-8 h-screen">
                <div className="relative group flex items-center">
                    <button className="p-2 rounded hover:scale-125 transition-transform duration-300 ease-in-out" onClick={() => route.push("/dashboard/homePage")}>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            height="24px" 
                            viewBox="0 -960 960 960" 
                            width="24px" 
                            fill="#e3e3e3"
                        >
                            <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
                        </svg>
                    </button>

                    <span className="whitespace-nowrap absolute left-full ml-3 px-3 py-1 text-sm font-medium text-white bg-[#64646465] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-1/2 transition-opacity duration-300">
                        Home
                    </span>
                </div>

                <div className="relative group flex items-center">
                    <button className="p-2 rounded hover:scale-125 transition-transform duration-300 ease-in-out" onClick={() => route.push("/dashboard/studentRecords")}>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            height="24px" 
                            viewBox="0 -960 960 960" 
                            width="24px" 
                            fill="#e3e3e3"
                        >
                            <path d="M720-240q25 0 42.5-17.5T780-300q0-25-17.5-42.5T720-360q-25 0-42.5 17.5T660-300q0 25 17.5 42.5T720-240Zm0 120q32 0 57-14t42-39q-20-16-45.5-23.5T720-204q-28 0-53.5 7.5T621-173q17 25 42 39t57 14Zm-520 0q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Z"/>
                        </svg>
                    </button>
                    
                    <span className="whitespace-nowrap absolute left-full ml-3 px-3 py-1 text-sm font-medium text-white bg-[#64646465] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-1/2 transition-opacity duration-300">
                        Student Records
                    </span>
                </div>

                <div className="relative group flex items-center">
                    <button className="p-2 rounded hover:scale-125 transition-transform duration-300 ease-in-out" onClick={() => route.push("/dashboard/addRemoveSubject")}>
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            height="24px" 
                            viewBox="0 -960 960 960" 
                            width="24px" 
                            fill="#e3e3e3"
                        >
                            <path d="M520-400h80v-120h120v-80H600v-120h-80v120H400v80h120v120ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/>
                        </svg>
                    </button>

                    <span className="whitespace-nowrap absolute left-full ml-3 px-3 py-1 text-sm font-medium text-white bg-[#64646465] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-1/2 transition-opacity duration-300">
                        Add/Remove Courses
                    </span>
                </div>

                <div className="relative group flex items-center">
                    <button className="p-2 rounded hover:scale-125 transition-transform duration-300 ease-in-out" onClick={() => route.push("/dashboard/addRemoveStudents")}>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            height="24px" 
                            viewBox="0 -960 960 960" 
                            width="24px" 
                            fill="#e3e3e3"
                        >
                            <path d="M500-482q29-32 44.5-73t15.5-85q0-44-15.5-85T500-798q60 8 100 53t40 105q0 60-40 105t-100 53Zm220 322v-120q0-36-16-68.5T662-406q51 18 94.5 46.5T800-280v120h-80Zm80-280v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Zm-480-40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM0-160v-112q0-34 17.5-62.5T64-378q62-31 126-46.5T320-440q66 0 130 15.5T576-378q29 15 46.5 43.5T640-272v112H0Zm320-400q33 0 56.5-23.5T400-640q0-33-23.5-56.5T320-720q-33 0-56.5 23.5T240-640q0 33 23.5 56.5T320-560ZM80-240h480v-32q0-11-5.5-20T540-306q-54-27-109-40.5T320-360q-56 0-111 13.5T100-306q-9 5-14.5 14T80-272v32Zm240-400Zm0 400Z"/>
                        </svg>
                    </button>

                    <span className="whitespace-nowrap absolute left-full ml-3 px-3 py-1 text-sm font-medium text-white bg-[#64646465] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-1/2 transition-opacity duration-300">
                        Add/Remove Students
                    </span>
                </div>

                <div className="relative group flex items-center">
                    <button className="p-2 rounded hover:scale-125 transition-transform duration-300 ease-in-out" onClick={() => route.push("/dashboard/generateQR")}>
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            height="24px" 
                            viewBox="0 -960 960 960" 
                            width="24px" 
                            fill="#e3e3e3"
                        >
                            <path d="M120-520v-320h320v320H120Zm80-80h160v-160H200v160Zm-80 480v-320h320v320H120Zm80-80h160v-160H200v160Zm320-320v-320h320v320H520Zm80-80h160v-160H600v160Zm160 480v-80h80v80h-80ZM520-360v-80h80v80h-80Zm80 80v-80h80v80h-80Zm-80 80v-80h80v80h-80Zm80 80v-80h80v80h-80Zm80-80v-80h80v80h-80Zm0-160v-80h80v80h-80Zm80 80v-80h80v80h-80Z"/>
                        </svg>
                    </button>

                    <span className="whitespace-nowrap absolute left-full ml-3 px-3 py-1 text-sm font-medium text-white bg-[#64646465] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-1/2 transition-opacity duration-300">
                        Generate QR
                    </span>
                </div>
                
                <div className="relative group flex items-center">
                    <button className="p-2 rounded hover:scale-125 transition-transform duration-300 ease-in-out" onClick={() => route.push("/dashboard/scanner")}>
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            height="24px" 
                            viewBox="0 -960 960 960" 
                            width="24px" 
                            fill="#e3e3e3"
                        >
                            <path d="M80-680v-200h200v80H160v120H80Zm0 600v-200h80v120h120v80H80Zm600 0v-80h120v-120h80v200H680Zm120-600v-120H680v-80h200v200h-80ZM700-260h60v60h-60v-60Zm0-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm120-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm240-320v240H520v-240h240ZM440-440v240H200v-240h240Zm0-320v240H200v-240h240Zm-60 500v-120H260v120h120Zm0-320v-120H260v120h120Zm320 0v-120H580v120h120Z"/>
                        </svg>
                    </button>
                    
                    <span className="whitespace-nowrap absolute left-full ml-3 px-3 py-1 text-sm font-medium text-white bg-[#64646465] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-1/2 transition-opacity duration-300">
                        QR Scanner
                    </span>
                </div>
                
                <div className="relative group flex items-center">
                    <button className="p-2 rounded hover:scale-125 transition-transform duration-300 ease-in-out" onClick={handleLogOut}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#e3e3e3"
                        >
                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
                        </svg>

                        <span className="whitespace-nowrap absolute left-full ml-3 px-3 py-1 text-sm font-medium text-white bg-[#64646465] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-1/2 transition-opacity duration-300">
                            Log out
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>

  )
}
