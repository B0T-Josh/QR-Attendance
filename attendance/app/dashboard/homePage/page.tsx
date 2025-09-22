"use client";

import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getId } from "@/tools/getId";
import { useEffect, useState } from "react";
import { getAllRecords, getStudents, getSubjects, getValidation, validateTeacher } from "@/app/api/requests/request";
import Popup from "@/components/Popup";

type Subjects = {
  id: string;
  name: string;
}

type Record = {
  id: string | null | undefined;
  student_id: string | null | undefined;
  name: string | null | undefined;
  date: string | null | undefined;
  subject: string | null | undefined;
  time_in: string | null | undefined;
  time_out: string | null | undefined;
}

type Students = {
  id: string;          // primary key in Supabase
  student_id: string;  // school/student number
  name: string;        // student name
  subjects: string;     // subject they’re enrolled in
};

export default function HomePage() {
    const route = useRouter();
    const [hasVerification, setHasVerification] = useState(false); 
    const [id, setId] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [subjects, setSubjects] = useState<Subjects[] | []>([]);
    const [record, setRecord] = useState<Record[] | []>([]);
    const [students, setStudents] = useState<Students[]>([]);

    const get = async () => {
        const res = await getStudents();
        setStudents(res.data || []);
    };

    useEffect(() => {
    if(!subjects) return;
    async function getRecords() {
        const {data, error} = await getAllRecords({subjects: subjects});
        if(data) {
            setRecord(data);
        } else {
            console.log({error});
        }
    }
    getRecords();
    }, [subjects]);

    useEffect(() => {
        if(!id) return;
        if(subjects.length == 0) {
            async function getSubject() {
                const res = await getSubjects({id: id});
                console.log({res});
                setSubjects(res.data || []);
            }
            getSubject();
        }
    }, [id]);

    useEffect(() => {
        if(parseInt(getId() || '0') <= 0) {
            route.push("/authPages/login");
        }
        async function validate() {
            const {success} = await validateTeacher({uid: localStorage.getItem("id")});
            if(success) {
                setId(localStorage.getItem("id"));
                get();
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
                                                {students.length > 0 ? (
                                                    students.map(stud => (
                                                        <tr key={stud.id}>
                                                            <td>{stud.name}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td>No records</td>
                                                    </tr>
                                                )}
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
                                    <div className="text-left max-h-[300px]">
                                        <table className="w-full">
                                            <tbody>
                                                {subjects.length > 0 ? (
                                                    subjects.map(sub => (
                                                        <tr key={sub.id}>
                                                            <td>{sub.name}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td>No records</td>
                                                    </tr>
                                                )}
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
                                <div className="text-left overflow-auto max-h-[50rem]">
                                    <table className="w-full">
                                        <thead className="justify-center text-center">
                                            <tr>
                                                <th className="px-4 py-2">Attendance</th>
                                                <th className="px-4 py-2">Name</th>
                                                <th className="px-4 py-2">Date</th>
                                            </tr>
                                        </thead>

                                        <tbody className="justify-center text-center">
                                            {record.length > 0 ? (
                                                record.map(att => (
                                                    <tr key={att.id}>
                                                        <td className="flex justify-center items-center">{
                                                            att.time_out ? 
                                                            <svg 
                                                                xmlns="http://www.w3.org/2000/svg" 
                                                                height="24px" 
                                                                viewBox="0 -960 960 960" 
                                                                width="24px" 
                                                                fill="#e3e3e3"
                                                            >
                                                                <path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/>
                                                            </svg>
                                                            : 
                                                            <svg 
                                                                xmlns="http://www.w3.org/2000/svg" 
                                                                height="24px" 
                                                                viewBox="0 -960 960 960" 
                                                                width="24px" 
                                                                fill="#9a1313"
                                                            >
                                                                <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/>
                                                            </svg>
                                                            }
                                                        </td>
                                                        <td>{att.name}</td>
                                                        <td>{att.date}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td>No records</td>
                                                </tr>
                                            )}
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