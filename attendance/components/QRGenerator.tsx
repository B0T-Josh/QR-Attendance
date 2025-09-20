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
    const [student_id, setStudentId] = useState<string | null>(null);
    const [finalProfile, setFinalProfile] = useState({
        name : "",
        student_id : ""
    });
    const [studentList, setStudentList] = useState<Student[]>([]);
    const [content, setContent] = useState<string | "">("");
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);
    const [error, setError] = useState<any>(null);

    const handleIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setStudentId(value);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }
        typingTimeout.current = setTimeout(() => {
            setProfile(value);
        }, 1000);
    };
    
    useEffect(() => {
        setErrorBool(false);
        if(profile && student_id) {
            const data: any = format(profile);
            const found = studentList.find(item => ((item.student_id === student_id) && (item.name === data.formatted)));
            if(found) {
                if(data.formatted) {
                    setFinalProfile(prev => ({
                        ...prev,
                        name: data.formatted,
                        student_id: student_id || ""
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
    }, [profile])

    useEffect(() => {
        if(studentList.length > 0) return;
        async function getAllStudents() {
            const {data, error} = await getStudents();
            if(data) {
                setStudentList(data);
            }
        }
        setContent(`Encoded: `);    
        getAllStudents();
    }, [])

    useEffect(() => {
        if(!finalProfile.name && !finalProfile.student_id) return;
        setContent(`Encoded: ${finalProfile.name} | ${finalProfile.student_id}`);    
    }, [finalProfile])

    useEffect(() => {
        setTimeout(() => {
            setErrorBool(false);
        }, 2000);
    }, [errorBool]);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center min-h-screen space-y-8">
            <div className="flex flex-col justify-center items-center border rounded-lg w-[25rem] h-[35rem] space-y-6">
                <h2 className="text-xl font-bold mb-4">QR Code Generator</h2>
                {errorBool ? error : ""}
                <input className="border rounded-lg p-1 w-[17rem]" type="text" placeholder="Student ID" onChange={handleIDChange} name="student_id"/>
                <input className="border rounded-lg p-1 w-[17rem]" type="text" placeholder="SURNAME, Firstname M.I." onChange={handleNameChange} name="name"/>
                <div className="flex flex-col items-center justify-center align-center border rounded-lg p-4 w-[17rem]">
                    <QRCodeCanvas value={(finalProfile.name) + " | " + (finalProfile.student_id)} size={200} />
                </div>
                <div className="border rounded-lg p-1 w-[17rem]">
                        <p className="mt-2 text-sm text-gray-600">
                            {content}
                        </p>
                </div>
            </div>
        </div>
    )
}