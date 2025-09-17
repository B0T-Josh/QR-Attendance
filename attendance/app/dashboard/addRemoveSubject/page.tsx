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
    const [content, setContent] = useState<any>(null);
    const [sets, setSets] = useState<Subjects[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [process, setProcess] = useState<any>();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSubject(e.target.value);
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
            const { message, error } = await handleAddSubject({name: subject, id: id});
            setContent(message ? <p className="text-green-300">{message}</p> : <p className="text-red-500">{error}</p>);
            setSubject("");
            get();
        } else setContent(<p className="text-red-500">Enter a subject</p>);
    }

    async function handleRemove() {
        setLoading(true);
        if(subject) {
            const { message, error } = await handleRemoveSubject({name: subject, id: id});
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

                <div className="p-4 flex justify-center items-center m-auto w-1/2">
                    <div className="mt-auto mb-auto p-4  w-[20rem] h-auto">
                        <h2 className="p-2">Add Subject</h2>
                        {loading ? (<h3 className="text-gray-600">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Loading</h3>) : <p></p>}

                        <input type="text" name="subject" onChange={handleChange} placeholder="Enter subject" className="p-2 bg-transparent" value={subject || ""}/>

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