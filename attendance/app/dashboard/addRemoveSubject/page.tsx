'use client';

import Sidebar from "@/components/Sidebar";
import {useState, useEffect} from 'react';
import { useRouter } from "next/navigation";
import { getId } from "@/tools/getId"
import { handleAddSubject, handleRemoveSubject, getSubjects } from "@/app/api/requests/request";

type Subjects = {
    id: any;
    name: any;
}

export default function StudentRecords() {
    const router = useRouter();
    const [subject, setSubject] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [content, setContent] = useState<any>(null);
    const [sets, setSets] = useState<Subjects[]>([]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSubject(e.target.value);
    }

    const get = async () => {
        const res = await getSubjects({id: id});
        setSets(res.data || null);
    }

    useEffect(() => {
        if(getId() === null) {
            alert("Unauthorized set. Log in first");
            router.push("/authPages/login");
        } else {
            setId(getId());
        }
    }, []);

    useEffect(() => {
        if(!id) return;
        get();
    }, [id]);
    
    async function handleAdd() {
        if(subject) {
            const { message, error } = await handleAddSubject({name: subject, id: id});
            setContent(message ? <p className="text-green-300">{message}</p> : <p className="text-red-500">{error}</p>);
            setSubject("");
            get();
        } else setContent(<p className="text-red-500">Enter a subject</p>);
    }

    async function handleRemove() {
        if(subject) {
            const { message, error } = await handleRemoveSubject({name: subject, id: id});
            setContent(message ? <p className="text-green-300">{message}</p> : <p className="text-red-500">{error}</p>);
            setSubject("");
            get();
        } else setContent(<p className="text-red-500">Enter a subject</p>);
    }
    
    useEffect(() => {
        setTimeout(() => {
            setContent("");
        }, 2500);
    }, [content]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex-1 flex flex-col">

                <div className="absolute top-1 left-1/2 -translate-x-1/2">
                    {content}
                </div>

                <div className="p-4 flex flex-col items-center w-full">
                    <div className="mt-10 mb-10 p-4 border-2 rounded w-[20rem] h-[12rem]">
                        <h2 className="p-2">Add Subject</h2>
                        <p className="p-2">Enter Subject:</p>

                        <input type="text" name="subject" onChange={handleChange} placeholder="Enter subject" className="p-2" value={subject || ""}/>

                        <button className="p-3 text-gray-600 hover:text-green-300" onClick={handleAdd}>
                            Add
                        </button>

                        <button className="p-3 text-gray-600 hover:text-red-500" onClick={handleRemove}>
                            Remove
                        </button>
                    </div>
                    
                    <div className="flex-1 w-full border-2 rounded-lg overflow-y-auto">
                        <table className="table-auto border-collapse border border-gray-400 w-full h-full">
                            <thead>
                                <tr>
                                    <th className="border border-gray-400 px-4 py-2">ID</th>
                                    <th className="border border-gray-400 px-4 py-2">Subject</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sets.length > 0 ? (
                                    sets.map((set) => (
                                    <tr key={set.id} className="text-center">
                                        <td className="border border-gray-400 px-4 py-2">{set.id}</td>
                                        <td className="border border-gray-400 px-4 py-2">{set.name}</td>
                                    </tr>
                                    ))
                                ) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="border border-gray-400 px-4 py-2 text-center"
                                    >
                                        No users found
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

}