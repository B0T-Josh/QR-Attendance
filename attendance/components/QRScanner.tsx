"use client";
import { useEffect, useState, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { scanned, verifyStudentData } from "@/app/api/requests/request";
import { getSubjects } from "@/app/api/requests/request";

type Subject = {
    id: string;
    name: string;
}

type Student = {
    student_id: string;
    name: string;
    subjects: string;
}

export default function QRScanner() {
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [valid, setValid] = useState(true);
    const [subject, setSubject] = useState<string | "">("");
    const [content, setContent] = useState<any>(null);
    const [id, setId] = useState<string | "">("");
    const [loading, setLoading] = useState(false);
    const typeTimeout = useRef<NodeJS.Timeout | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [student, setStudent] = useState<Student | null>(null);

    useEffect(() => {
        const temp = localStorage.getItem("id");
        if(temp === null) return;
        setId(temp);
        const codeReader = new BrowserQRCodeReader();

        let controls: any;

        if (videoRef.current) {
        codeReader
            .decodeFromVideoDevice(undefined, videoRef.current, (res, err) => {
            if (res) {
                setScannedData(res.getText());
            }
            })
            .catch((err) => console.error("Camera error:", err));
        }
    }, []);


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {value} = e.target;
        if(typeTimeout.current) {
            clearTimeout(typeTimeout.current);
        }
        typeTimeout.current = setTimeout(() => {
            setSubject(e.target.value);
        }, 1000)
    }

    useEffect(() => {
        if(!subject) return;
        async function verifySubject() {
            const res = await getSubjects({id: id});
            const data: Subject[] = res.data;
            const found = data.find(sub => sub.name === subject);
            if(!found) {
                setValid(false);
            } else {
                setValid(true);
            }
        }
        verifySubject();
    }, [subject]);

    useEffect(() => {
        if (!scannedData) {
            return;
        }
        if (!subject || subject === "") {
            alert("Enter subject");
            return;
        }
        setLoading(true);
        const [name, student_id] = scannedData.split(" | ");
        async function verifyStudent() {
            const {data, error} = await verifyStudentData({name: name, id: student_id});
            if(data) {
                setStudent(data);
            } else {
                setLoading(false);
                setContent(<p className="text-red-500">{error}</p>);
                setTimeout(() => {
                    setContent("");
                }, 2000);
            }
        }
        verifyStudent();
    }, [scannedData]);

    useEffect(() => {  
        if(!student) return;
        let student_subject = student?.subjects;
        const found = student_subject?.includes(subject);
        if(found) {
            const handleAdd = async (data: any) => {
                const { message, error } = await scanned({ name: data.name, student_id: data.student_id, subject: subject });
                setContent(message ? <p className="text-green-300">{message}</p> : <p className="text-red-500">{error}</p>);
                setTimeout(() => {
                    setContent("");
                }, 2500);
                setLoading(false);
            };
            handleAdd({ name: student.name, student_id: student.student_id, subject: subject });
        } else {
            setContent(<p className="text-red-500">Student was not enrolled in this subject</p>);
            setTimeout(() => {
                setContent("");
            }, 2500);
            setLoading(false);
        }
    }, [student]);

    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col items-center p-4 border rounded-lg shadow-md w-50">
                {valid ? <p></p> : <p className="text-red-500 p-4">You don't have this {subject}</p>}
                {loading ? <p className="text-gray-600 p-4">Loading...</p> : <p className=" text-gray-600 p-4">Scanning...</p>}
                <input type="text" onChange={handleChange} name="subject" placeholder="Subject" className="border rounded-lg p-1 w-[17rem]"/><br/>
                <h2 className="text-xl font-bold mb-4">QR Code Scanner</h2>
                <div>{content}</div><br />
                <video
                    ref={videoRef}
                    style={{ width: "100%", maxWidth: "300px", borderRadius: "12px" }}
                />
            </div>
        </div>
    )
}