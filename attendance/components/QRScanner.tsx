"use client";
import { useEffect, useState, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { scanned, validateTeacher, verifyStudentData } from "@/app/api/requests/request";
import { getSubjects } from "@/app/api/requests/request";
import { useRouter } from "next/navigation";
import { getId } from "@/tools/getId";

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
    const route = useRouter();
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [subject, setSubject] = useState<string | "">("");
    const [content, setContent] = useState<React.ReactElement | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [student, setStudent] = useState<Student | null>(null);

    useEffect(() => {
        if(parseInt(getId() || '0') <= 0) {
            route.push("/authPages/login");
        }
        async function validate() {
            const {success} = await validateTeacher({uid: localStorage.getItem("id")});
            if(success) {
                setId(localStorage.getItem("id"));
            } else {
                localStorage.removeItem("id");
                route.push("/authPages/login");
            }
        }
        validate();
    }, []);

    useEffect(() => {
        const codeReader = new BrowserQRCodeReader();

        if (videoRef.current) {
        codeReader
            .decodeFromVideoDevice(undefined, videoRef.current, (res, err) => {
                if (res) {
                    setScannedData(res.getText());
                }
            })
        }
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setSubject(e.target.value);
    }

    useEffect(() => {
        if(!id) return;
        if(subject) return;
        async function verifySubject() {
            const res = await getSubjects({id: id});
            setSubjects(res.data);
        }
        verifySubject();
    }, [id]);

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
            const {data, error} = await verifyStudentData({name: name, student_id: student_id, subjects: subject});
            if(data) {
                setStudent(data);
            } else {
                setLoading(false);
                setContent(<p className="text-red-500">{error}</p>);
                setTimeout(() => {
                    setContent(null);
                }, 2000);
            }
        }
        verifyStudent();
    }, [scannedData]);

    useEffect(() => {  
        if(!student) return;
        const student_subject = student?.subjects;
        const found = student_subject?.includes(subject);
        if(found) {
            const handleAdd = async () => {
                const { message, error } = await scanned({ name: student.name, student_id: student.student_id, subjects: subject });
                setContent(message ? <p className="text-green-300">{message}</p> : <p className="text-red-500">{error}</p>);
                setTimeout(() => {
                    setContent(null);
                }, 2500);
                setLoading(false);
            };
            handleAdd();
        } else {
            setContent(<p className="text-red-500">Student was not enrolled in this subject</p>);
            setTimeout(() => {
                setContent(null);
            }, 2500);
            setLoading(false);
        }
    }, [student]);

    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col items-center p-4 w-50">
                {loading ? <p className="text-gray-600 p-4">Loading...</p> : <p className=" text-gray-600 p-4">Scanning...</p>}
                <select className="rounded-lg p-2" value={subject} name="subject" onChange={handleChange}>
                  <option value="">Select a subject</option>
                  {subjects ? subjects.length > 0 ? (
                    subjects.map(subject => (
                      <option key={subject.id} value={subject.name}>{subject.name}</option>
                    ))
                  ) : <option value="">No subject</option> : (<></>)}
                </select>
                <h2 className="text-xl font-bold mb-4 mt-4">QR Code Scanner</h2>
                <div>{content}</div><br />
                <video
                    ref={videoRef}
                    style={{ width: "100%", maxWidth: "300px", borderRadius: "12px" }}
                />
            </div>
        </div>
    )
}