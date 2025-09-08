"use client";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode"
import { scanned } from "@/app/api/endpoints";

export default function QRScanner() {
    const [scannedData, setScannedData] = useState<string>("");
    const [subject, setSubject] = useState<string>("");

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", {
            fps: 10,
            qrbox: { width: 250, height: 250 },
        }, false);
    
        scanner.render(
            async (decodedText: string) => {
                const [name, student_id] = decodedText.split(", ");
                setScannedData(decodedText);    
                console.log(`Decoded text: ${name} ${student_id}`);
            },
            (errorMessage: string) => {
                console.warn(`QR Code Scan Error: ${errorMessage}`);
            }
        );
        return () => {
            scanner.clear().catch((err) => console.error("failed to clear scanner ", err))
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubject(e.target.value);
    }

    useEffect(() => {
        if(!scannedData) {
            return;
        } else {
            const [name, student_id] = scannedData.split(", ");
            const handleAdd = async (data: any) => {
                console.log(`Adding ${data.name} ${data.student_id} ${data.subject}`);
                if(await scanned({name: data.name, student_id: data.student_id, subject: data.subject})) {
                    alert(`Attendance for ${data.name} is recorded`);
                    return;
                } else {
                    alert(`Attendance recording for ${data.name} was unsuccessful`);
                    return;
                }
            }  
            handleAdd({name: name, student_id: student_id, subject: subject});
        }
    }, [scannedData]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center p-4 border rounded-lg shadow-md w-50">
                <input type="text" onChange={handleChange} name="subject" value={subject} placeholder="Subject"/>
                <h2 className="text-xl font-bold mb-4">QR Code Scanner</h2>
                <div id="reader" style={{ width: "300px" }}></div>
            </div>
        </div>
    )
}