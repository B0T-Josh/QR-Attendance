'use client';

import Sidebar from "@/components/Sidebar";
import {useState, useEffect} from 'react';
import { useRouter } from "next/navigation";
import { getId } from "@/components/getId"
import { handleAddSubject, handleRemoveSubject } from "@/app/api/requests/request";

export default function StudentRecords() {
    const router = useRouter();
    const [subject, setSubject] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [content, setContent] = useState<any>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSubject(e.target.value);
    }

    useEffect(() => {
        if(getId() === null) {
            alert("Unauthorized user. Log in first");
            router.push("/authPages/login");
        } else {
            setId(getId());
        }
    }, []);
    
    async function handleAdd() {
        if(subject) {
            const { message, error } = await handleAddSubject({name: subject, id: id});
            setContent(message ? <p className="text-green-300">{message}</p> : <p className="text-red-500">{error}</p>);
        } else setContent(<p className="text-red-500">Enter a subject</p>);
    }

    async function handleRemove() {
        if(subject) {
            const { message, error } = await handleRemoveSubject({name: subject, id: id});
            setContent(message ? <p className="text-green-300">{message}</p> : <p className="text-red-500">{error}</p>);
        } else setContent(<p className="text-red-500">Enter a subject</p>);
    }
    
    useEffect(() => {
        setTimeout(() => {
            setContent("");
        }, 2500);
    }, [content]);

    useEffect(() => {
        setTimeout(() => {
            setSubject(null);
        }, 2500);
    }, [content]);

    return (
        <div>
            <Sidebar />
<<<<<<< HEAD
            <div>
                
=======
            <div className="flex fixed inset-0 justify-center items-top mt-[20rem]">
                    {content}
            </div>
            <div className="flex fixed inset-0 justify-center items-center">
                
                <div className="p-4 border-2 rounded w-[20rem] h-[12rem]">
                    <h2 className="p-2">Add Subject</h2>
                    <p className="p-2">Enter Subject: </p>
                    <input type="text" name="subject" onChange={handleChange} placeholder="Enter subject" className="p-2" value={subject || ""}/><br />   
                    <button className="p-3 text-gray-600 hover:text-green-300" onClick={handleAdd}>Add</button>
                    <button className="p-3 text-gray-600 hover:text-red-500" onClick={handleRemove}>Remove</button>
                </div>
>>>>>>> josh
            </div>            
        </div>
    );
}