"use client";
import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import format from "@/tools/format"
import { getStudents } from "@/app/api/requests/request";

type Student = {
    student_id: string;
    name: string;
    subjects: string;
}

export default function QRGenerator() {
    const [profile, setProfile] = useState<string | null>(null);
    const [errorBool, setErrorBool] = useState(false);
    const [studentId, setStudentId] = useState<string | null>(null);
    const [finalProfile, setFinalProfile] = useState({
        name : "",
        student_id : ""
    });
    const [studentList, setStudentList] = useState<Student[]>([]);
    const [content, setContent] = useState<string | "">("");
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);
    const [error, setError] = useState<React.ReactElement | null>(null);

    //Handle student id input.
    const handleIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }
        typingTimeout.current = setTimeout(() => {
            setStudentId(value);
        }, 1000);
    };

    //Handle name input.
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }
        typingTimeout.current = setTimeout(() => {
            setProfile(value);
        }, 1000);
    };
    
    //Handle QR generation.
    useEffect(() => {
        setErrorBool(false);
        if(profile && studentId) {
            //Formats the student name to SURNAME, Firstname M.I.
            const data = format(profile);
            if(data) {
                if(data.error) {
                    setError(<p className="text-red-500">{data.error}</p>);
                    return;
                } else if(data.formatted) {
                    //Evaluate the student if enrolled.
                    const found = studentList.find(item => ((item.student_id.trim() === studentId.trim()) && (item.name.trim() === data.formatted)));
                    if(found) {
                        if(data.formatted) {
                            setFinalProfile(prev => ({
                                ...prev,
                                name: data.formatted,
                                student_id: studentId || ""
                            }))
                        } else {
                            setErrorBool(true);
                            setError(<p className="text-red-500">{data.error}</p>);
                        }
                    } else {
                        setErrorBool(true);
                        setError(<p className="text-red-500">Student was not enrolled</p>);
                        setContent(`Encoded: `);    
                        setFinalProfile({
                            ...finalProfile,
                            name: "",
                            student_id: ""
                        });
                    }
                }
            }
        }
    }, [profile, studentId])

    //GetAllStudent from the DB.
    useEffect(() => {
        if(studentList.length > 0) return;
        async function getAllStudents() {
            const {data} = await getStudents();
            if(data) {
                setStudentList(data);
            }
        }
        setContent(`Encoded: `);    
        getAllStudents();
    }, [])

    //Set content value to the encoded profile.
    useEffect(() => {
        if(!finalProfile.name && !finalProfile.student_id) return;
        setContent(`Encoded: ${finalProfile.name} | ${finalProfile.student_id}`);    
    }, [finalProfile]);

    //Set error bool to false.
    useEffect(() => {
        setTimeout(() => {
            setErrorBool(false);
        }, 2000);
    }, [errorBool]);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center min-h-screen space-y-8 bg-white">
            <div className="flex flex-col justify-center items-center w-[25rem] h-[35rem] space-y-6">
                <h2 className="text-xl font-bold mb-4 text-black text-center">QR Code Generator</h2>
                {errorBool ? error : ""}
                <input className="pl-2  rounded-lg p-1 w-[17rem] bg-[#cfcfcf] placeholder-[#808080be] text-black" type="text" placeholder="Student ID" onChange={handleIDChange} name="student_id"/>
                <input className="pl-2  rounded-lg p-1 w-[17rem] bg-[#cfcfcf] placeholder-[#808080be] text-black" type="text" placeholder="SURNAME, Firstname M.I." onChange={handleNameChange} name="name"/>
                {(finalProfile.name && finalProfile.student_id) != "" ? (<p className="text-black">Screenshot your QR within the border</p>) : (null)}
                <div className="border-2 border-gray-500">   
                    <div className="flex flex-col items-center justify-center align-center rounded-lg p-4 w-[17rem]">
                        <QRCodeCanvas value={(finalProfile.name) + " | " + (finalProfile.student_id)} size={200} />
                    </div>
                    <div className="w-[17rem] text-center p-4">
                            <p className="text-sm rounded-lg text-gray-600 bg-[#cfcfcf] h-[3rem]">
                                {content}
                            </p>
                    </div>
                </div>
            </div>
        </div>
    )
}