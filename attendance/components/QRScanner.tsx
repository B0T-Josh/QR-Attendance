"use client";
import { useEffect, useState, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { getStudentByTeacherSubject, scanned, verifyUser, getSubjects } from "@/app/api/requests/request";
import { useRouter } from "next/navigation";

type Subject = {
    id: string;
    name: string;
}

type Student = {
    student_id: string | null;
    name: string | null;
    subjects: string[];
    year: number | 0;
}

export default function QRScanner() {
    const route = useRouter();
    const ranOnce = useRef(false);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [subject, setSubject] = useState<string | "">("");
    const [content, setContent] = useState<React.ReactElement | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [student, setStudent] = useState<Student | null>(null);
    const [students, setStudents] = useState<Student[] | []>([]);
    const [subjectNames, setSubjectNames] = useState<string[]>([]);


    //Check if user is authorized.
    useEffect(() => {
        if(ranOnce.current) return;
        ranOnce.current = true;
        async function validate() {
        const {data} = await verifyUser();
        if (data.admin === "false") {
            if(data.success) {
                setId(data.success);    
            }
        } else if(data.admin === "true") {
            if(data.success) {
                route.push("/adminDashboard/manageStudent");
            }
        } else {
            route.push("/authPages/login");
        }
        }
        validate();
    }, []);
    
    //Setup for the qr scanner.
    useEffect(() => {
        const codeReader = new BrowserQRCodeReader();

        if (videoRef.current) {
        codeReader
            .decodeFromVideoDevice(undefined, videoRef.current, (res) => {
                if (res) {
                    setScannedData(res.getText());
                }
            })
        }
    }, []);

    //Handle subject selection
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setSubject(e.target.value);
    }

    //Get all student related to user.
    async function getStudentBySubject() {
        const res = await getStudentByTeacherSubject({subjects: subjectNames});
        setStudents(res.data || []);
    }

    useEffect(() => {
        if(subjectNames.length > 0) return;
        setSubjectNames(subjects.map(sub => sub.name));
    }, [subjects]);    

    //Set subject after setting id.
    useEffect(() => {
        if(!id) return;
        if(subject.length > 0) return;
        async function verifySubject() {
            const res = await getSubjects({id: id});
            setSubjects(res.data || []);
        }
        verifySubject();
        if(students.length > 0) return;
    }, [id]);

    useEffect(() => {
        if(subjectNames.length === 0) return;
        getStudentBySubject();
    }, [subjectNames]);

    //Verify student if he/she exist and set the student to the found value.
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
        const found = students.find((stud) => {return (
            (name == stud.name) &&
            (student_id == stud.student_id) &&
            (stud.subjects?.includes(subject))
        )});
        alert({found});
        if(found) {
            setStudent(found);
        } else {
            setLoading(false);
            setContent(<p className="text-red-500">{"Student doesn't exist"}</p>);
            setStudent(null);
        }
    }, [scannedData]);

    //After setting student, add student to the record.
    useEffect(() => { 
        if(!student) {
            return;
        }
        const handleAdd = async () => {
            const { message, error } = await scanned({ name: student.name, student_id: student.student_id, subjects: subject, year: student.year });
            setContent(message ? <p className="text-green-300">{message}</p> : <p className="text-red-500">{error}</p>);
            setLoading(false);
        };
        handleAdd();
    }, [student]);

    //Set reset content value.
    useEffect(() => {
        if(!content) return;
        setTimeout(() => {
            setContent(null);
        }, 2500);
    }, [content]);

    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col items-center p-4 w-50">
                {loading ? <p className="text-gray-600 p-4">Loading...</p> : <p className=" text-gray-600 p-4">Scanning...</p>}
                <select className="rounded-lg p-2 bg-[#3B3B3B] placeholder-gray" value={subject} name="subject" onChange={handleChange}>
                  <option value="">Select a subject</option>
                  {subjects && subjects.length > 0 ? (
                    subjects.map(subject => (
                      <option key={subject.id} value={subject.name}>{subject.name}</option>
                    ))
                  ) : <option value="">No subject</option>}
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