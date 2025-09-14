"use client";
import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { TIMEOUT } from "node:dns";

export default function QRGenerator() {
    const [profile, setProfile] = useState({
        name : "",
        student_id : ""
    });
    const [finalProfile, setFinalProfile] = useState({
        name : "",
        student_id : ""
    });
    const [content, setContent] = useState<string | "">("");
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);

    function format() {
        try {
            if(profile.name) {
                var temp = profile.name.replace(",", "").replace(".", "").split(" ");
                var last_name = temp[0].toUpperCase();
                var first_name = temp[1].charAt(0).toUpperCase() + temp[1].substring(1).toLowerCase() + " ";
                if(temp.length > 3) {
                    for(let i = 2; i < temp.length - 1; i++) {
                        first_name += temp[i].charAt(0).toUpperCase() + temp[i].substring(1).toLowerCase() + " ";
                    }
                } 
                var middle_ini = temp[temp.length-1].toUpperCase() + '.';
                var formatted = last_name + ", " + first_name + middle_ini;
                setFinalProfile((prev) => ({
                    ...prev,
                    name: formatted,
                    student_id: profile.student_id
                }));
            }
        } catch(error) {
            console.log(error);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }
        typingTimeout.current = setTimeout(() => {
            setProfile((prevProfile) => ({
                ...prevProfile,
                name: value,
            }));
        }, 2000);
    };
    
    useEffect(() => {
        format();
    }, [profile])

    useEffect(() => {
        setContent(`Encoded: ${finalProfile.name} | ${finalProfile.student_id}`);
    }, [finalProfile])

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center min-h-screen space-y-8">
            <div className="flex flex-col justify-center items-center border rounded-lg w-[25rem] h-[35rem] space-y-6">
                <h2 className="text-xl font-bold mb-4">QR Code Generator</h2>
                <input className="border rounded-lg p-1 w-[17rem]" type="text" placeholder="Student ID" onChange={handleChange} name="student_id"/>
                <input className="border rounded-lg p-1 w-[17rem]" type="text" placeholder="SURNAME, Firstname M.I." onChange={handleChange} name="name"/>
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