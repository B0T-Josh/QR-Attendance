"use client";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRGenerator() {
    const [profile, setProfile] = useState({
        name : null,
        student_id : null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
            <h2 className="text-xl font-bold mb-4">QR Code Generator</h2>
            <input type="text" placeholder="Student ID" onChange={handleChange} name="student_id"/><br/>
            <input type="text" placeholder="Name" onChange={handleChange} name="name"/><br/>
            <QRCodeCanvas value={(profile.name ?? "") + ", " + (profile.student_id ?? "")} size={200}/>
            <p className="mt-2 text-sm text-gray-600">
                Encoded: {(profile.name ?? "") + ", " + (profile.student_id ?? "")}
            </p>
        </div>
    )
}