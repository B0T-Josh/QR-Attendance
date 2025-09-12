"use client";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode"
import { scanned } from "@/app/api/requests/request";

export default function QRScanner() {
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [subject, setSubject] = useState<string | null>(null);
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", {
            fps: 10,
            qrbox: { width: 250, height: 250 },
        }, false);
    
        scanner.render(
            async (decodedText: string) => {
                setScannedData(decodedText);
            },
            (errorMessage: string) => {
                setContent(<p className="text-red-500">{errorMessage}</p>);
                setTimeout(() => {
                    setContent("");
                }, 2500);
            }
        );
        return () => {
            scanner.clear().catch((err) => console.error("failed to clear scanner ", err))
        }
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSubject(e.target.value);
    }

    useEffect(() => {
        if (!scannedData) {
            return;
        }
        if (!subject || subject === "") {
            alert("Enter subject");
            return;
        }
        const [name, student_id] = scannedData.split(" | ");
        const handleAdd = async (data: any) => {
            const { message, error } = await scanned({ name: data.name, student_id: data.student_id, subject: data.subject });
            setContent(message ? <p className="text-green-300">{message}</p> : <p className="text-red-500">{error}</p>);
            setTimeout(() => {
                setContent("");
            }, 2500);
        };
        handleAdd({ name: name, student_id: student_id, subject: subject });
    }, [scannedData]);

    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col items-center p-4 border rounded-lg shadow-md w-50">
                <input type="text" onChange={handleChange} name="subject" value={subject || ""} placeholder="Subject" className="border rounded-lg p-1 w-[17rem]"/><br/>
                <h2 className="text-xl font-bold mb-4">QR Code Scanner</h2>
                <div>{content}</div><br />
                <div id="reader" style={{ width: "300px" }}></div>
            </div>
        </div>
    )
}