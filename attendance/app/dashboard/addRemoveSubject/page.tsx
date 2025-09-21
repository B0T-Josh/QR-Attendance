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
    const route = useRouter();
    const [subject, setSubject] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [content, setContent] = useState<React.ReactElement | null>(null);
    const [sets, setSets] = useState<Subjects[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSubject(e.target.value.toUpperCase());
    }

    const get = async () => {
        const res = await getSubjects({id: id});
        setSets(res.data || []);
    }

    useEffect(() => {
        if(parseInt(getId() || '0') <= 0) {
            route.push("/authPages/login");
        }
        setId(getId());
    }, []);

    useEffect(() => {
        if(!id) return;
        get();
    }, [id]);
    
    async function handleAdd() {
        setLoading(true);
        if(subject) {
            const { message, error } = await handleAddSubject({id: id, subjects: subject});
            setContent(message ? <p className="text-green-300">{message}</p> : <p className="text-red-500">{error}</p>);
            setSubject("");
            get();
        } else setContent(<p className="text-red-500">Enter a subject</p>);
    }

    async function handleRemove() {
        setLoading(true);
        if(subject) {
            const { message, error } = await handleRemoveSubject({subjects: subject, id: id});
            setContent(message ? <p className="text-green-300">{message}</p> : <p className="text-red-500">{error}</p>);
            setSubject("");
            get();
        } else setContent(<p className="text-red-500">Enter a subject</p>);
    }
    
    useEffect(() => {
        setLoading(false);
        setTimeout(() => {
            setContent("");
        }, 2500);
    }, [content]);

    useEffect(() => {
        setTimeout(() => {
            setLoaded(true);
        }, 1000)
    }, [sets]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            {loaded ? (
                <div className="flex-1 flex flex-col">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2">
                        {content}
                    </div>

                    <div className="p-4 flex flex-col justify-center items-center m-auto w-1/2">
                        <div className="w-full max-w-5xl p-4 border-b border-[#8d8a8a] flex flex-wrap gap-4 items-center">
                            {loading ? (
                                <h2 className="p-2 text-gray-600">Loading</h2>
                            ) : (
                                <h2 className="p-2 font-medium">Add Subject:</h2>
                            )}

                            <input
                                type="text"
                                name="subject"
                                onChange={handleChange}
                                placeholder="Enter subject"
                                className="p-2 rounded-lg border border-gray-300"
                                value={subject || ""}
                            />

                            <button
                                className="px-4 py-2 text-gray-600 hover:text-green-500"
                                onClick={handleAdd}
                            >
                                Add
                            </button>

                            <button
                                className="px-4 py-2 text-gray-600 hover:text-red-500"
                                onClick={handleRemove}
                            >
                                Remove
                            </button>
                        </div>

                    
                        <div className="mt-4 flex-1 w-full border-2 rounded-lg overflow-y-auto border-[#c7c7c79f]">
                            <table className="table-auto border-collapse border w-full h-full">
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
                                        <td colSpan={3} className="border border-gray-400 px-4 py-2 text-center">
                                            No subjects found
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : <p></p>}
        </div>
    );
}