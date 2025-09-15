"use client";

import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getId } from "@/tools/getId";
import { useEffect, useState } from "react";
import { getValidation } from "@/app/api/requests/request";
import Popup from "@/components/Popup";

export default function HomePage() {
    const route = useRouter();
    const [hasVerification, setVerification] = useState(false); 
    const [id, setId] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if(parseInt(getId() || '0') <= 0) {
            route.push("/authPages/login");
        }
        if(getId() === null) return;
        setId(getId());
    }, [])

    useEffect(() => {
        if(id === null) return;
        async function validate() {
            const { verification } = await getValidation({id: id});
            if(verification) {
                setVerification(true);
            }
        }
        validate();    
    }, [id]);

    useEffect(() => {
        setTimeout(() => {
            setLoaded(true);
        }, 1150)
    }, [hasVerification]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            {loaded ? hasVerification ? (
                <div className="flex-1 p-6">
                <div className="flex flex-col md:flex-row gap-6 h-full">
                    <div className="flex-1 flex flex-col gap-6">
                        <div className="bg-[#2e2e2ec0] rounded-lg flex-1 transition-all duration-500 hover:flex-[3]">
                            <Link href={"/dashboard/addRemoveStudents"}>
                                <div className="p-4 h-full flex justify-left">
                                    Students Masterlist:
                                </div>
                            </Link>
                        </div>
                        
                        <div className="bg-[#2e2e2ec0] rounded-lg flex-1 transition-all duration-500 hover:flex-[3]">
                            <Link href={"/dashboard/addRemoveSubject"}>
                                <div className="p-4 h-full flex justify-left">
                                    Subjects:
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 bg-[#2e2e2ec0] rounded-lg transition-all duration-500 hover:flex-[3] h-full">
                        <Link href={"/dashboard/StudentRecords"}>
                            <div className="p-4 h-full flex justify-left">
                                Student Attendance Records:
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        ) : (<Popup />) : <p></p>}
        </div>
    );
}