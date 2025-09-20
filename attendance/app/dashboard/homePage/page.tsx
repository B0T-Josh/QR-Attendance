"use client";

import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getId } from "@/tools/getId";
import { useEffect, useState } from "react";
import { getValidation, validateTeacher } from "@/app/api/requests/request";
import Popup from "@/components/Popup";

export default function HomePage() {
    const route = useRouter();
    const [hasVerification, setHasVerification] = useState(false); 
    const [id, setId] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if(parseInt(getId() || '0') <= 0) {
            route.push("/authPages/login");
        }
        async function validate() {
            const {success} = await validateTeacher({id: localStorage.getItem("id")});
            if(success) {
                setId(getId());
            } else {
                localStorage.removeItem("id");
                route.push("/authPages/login");
            }
        }
        validate();
    }, []);

    useEffect(() => {
        if(id === null) return;
        async function validate() {
            const { message } = await getValidation({id: id});
            if(message) {
                setHasVerification(true);
            }
        }
        validate();    
    }, [id]);

    useEffect(() => {
        setTimeout(() => {
            setLoaded(true);
        }, 1500)
    }, [hasVerification]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            {loaded ? hasVerification ? (
                <div className="flex-1 p-6">
                <div className="flex flex-col md:flex-row gap-6 h-full">
                    <div className="flex-1 flex flex-col gap-6">
                        <div className="bg-[#2e2e2ec0] rounded-lg flex-1 min-h-[200px] transition-all duration-500 hover:flex-[3] overflow-hidden">
                            <Link href={"/dashboard/addRemoveStudent"}>
                                <div className="p-4 h-full">
                                    <h2 className="mb-4">Students Masterlist:</h2>
                                    <div className="text-left overflow-auto max-h-[300px]">
                                        <table className="w-full">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2 text-left">Name</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr><td className="px-4 py-2">Santos, Joshua A.</td></tr>
                                                <tr><td className="px-4 py-2">Santos, Joshua B.</td></tr>
                                                <tr><td className="px-4 py-2">Santos, Joshua C.</td></tr>
                                                <tr><td className="px-4 py-2">Santos, Joshua D.</td></tr>
                                                <tr><td className="px-4 py-2">Santos, Joshua E.</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        
                        <div className="bg-[#2e2e2ec0] rounded-lg flex-1 min-h-[200px] transition-all duration-500 hover:flex-[3] overflow-hidden">
                            <Link href={"/dashboard/addRemoveSubject"}>
                                <div className="p-4 h-full">
                                    <h2 className="mb-4">Subjects:</h2>
                                    <div className="text-left overflow-auto max-h-[300px]">
                                        <table className="w-full">
                                            <tbody>
                                                <tr><td className="px-4 py-2 text-left">[Subject]</td></tr>
                                                <tr><td className="px-4 py-2 text-left">[Subject]</td></tr>
                                                <tr><td className="px-4 py-2 text-left">[Subject]</td></tr>
                                                <tr><td className="px-4 py-2 text-left">[Subject]</td></tr>
                                                <tr><td className="px-4 py-2 text-left">[Subject]</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-[#2e2e2ec0] rounded-lg flex-1 min-h-[200px] transition-all duration-500 hover:flex-[3] overflow-hidden">
                        <Link href={"/dashboard/studentRecords"}>
                            <div className="p-4 h-full">
                                <h2 className="mb-4">Students Records:</h2>
                                <div className="text-left overflow-auto max-h-[300px]">
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2">Present</th>
                                                <th className="px-4 py-2">Absent</th>
                                                <th className="px-4 py-2">Name</th>
                                                <th className="px-4 py-2">Date</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td className="px-4 py-2">[Check]</td>
                                                <td className="px-4 py-2">[X]</td>
                                                <td className="px-4 py-2">Santos, Joshua A.</td>
                                                <td className="px-4 py-2">2025-09-12</td>
                                            </tr>

                                            <tr>
                                                <td className="px-4 py-2">[Check]</td>
                                                <td className="px-4 py-2">[X]</td>
                                                <td className="px-4 py-2">Santos, Joshua B.</td>
                                                <td className="px-4 py-2">2025-09-11</td>
                                            </tr>

                                            <tr>
                                                <td className="px-4 py-2">[Check]</td>
                                                <td className="px-4 py-2">[X]</td>
                                                <td className="px-4 py-2">Santos, Joshua C.</td>
                                                <td className="px-4 py-2">2025-09-10</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        ) : (<Popup />) : <p></p>}
        </div>
    );
}