"use client";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRGenerator() {
    const [profile, setProfile] = useState({
        name : "",
        student_id : ""
    });
    const [content, setContent] = useState<string | "">("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };
    
    useEffect(() => {
        setContent(`Encoded: ${profile.name} | ${profile.student_id}`);
    }, [profile])

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center min-h-screen space-y-8">
            <div className="flex flex-col justify-center items-center border rounded-lg w-[25rem] h-[35rem] space-y-6">
                <h2 className="text-xl font-bold mb-4">QR Code Generator</h2>
                <input className="border rounded-lg p-1 w-[17rem]" type="text" placeholder="Student ID" onChange={handleChange} name="student_id"/>
                <input className="border rounded-lg p-1 w-[17rem]" type="text" placeholder="SURNAME, Firstname M.I." onChange={handleChange} name="name"/>
                <div className="flex flex-col items-center justify-center align-center border rounded-lg p-4 w-[17rem]">
                    <QRCodeCanvas value={(profile.name) + " | " + (profile.student_id)} size={200} />
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