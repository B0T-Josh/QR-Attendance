'use client';

import Sidebar from "@/components/Sidebar";
import {useState, useEffect, useRef} from 'react';
import { useRouter } from "next/navigation";
import { handleAddSubject, handleRemoveSubject, getSubjects, verifyUser } from "@/app/api/requests/request";

type Subjects = {
    id: string | null;
    name: string | null;
}

export default function StudentRecords() {
    const route = useRouter();
    const ranOnce = useRef(false);
    const [subject, setSubject] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [content, setContent] = useState<React.ReactElement | null>(null);
    const [sets, setSets] = useState<Subjects[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    //Handle input
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSubject(e.target.value.toUpperCase());
    }

    //Fetch all subject for the user.
    const get = async () => {
        const res = await getSubjects({id: id});
        setSets(res.data || []);
    }

    useEffect(() => {   
        setLoaded(true);
    }, [sets]);

    //Check if user is authorized.
  useEffect(() => {
    if(ranOnce.current) return;
    ranOnce.current = true;
    async function validate() {
      const {data} = await verifyUser();
      if(data) {
        if (data.admin === "false") {
          if(data.success) {
            setId(data.success);    
          }
        } else if(data.admin === "true") {
          if(data.success) {
            route.push("/adminDashboard/manageStudent");
          }
        } 
      } else {
        route.push("/authPages/login");
      }
    }
    validate();
  }, []);
    
    //Execute fetching of subjects after the id was set
    useEffect(() => {
        if(!id) return;
        get();
    }, [id]);
    
    //Handle add subject
    async function handleAdd() {
        setLoading(true);
        if(subject) {
            const subjectArray = subject.trim().split(/\s*,\s*|\s+/);
            if(subjectArray.length > 1) {
                setLoading(false);
                setContent(<p className="text-red-500">Subject cannot contain multiple subjects</p>);
                setSubject("");
                return;
            } else {
                const { message, error } = await handleAddSubject({id: id, subjects: subject});
                setContent(message ? <p className="text-green-300">{message}</p> : <p className="text-red-500">{error}</p>);
                setSubject("");
                get();
            }
        } else setContent(<p className="text-red-500">Enter a subject</p>);
    }

    //Handle remove subject.
    async function handleRemove() {
        setLoading(true);
        if(subject) {
            const { message, error } = await handleRemoveSubject({subjects: subject, id: id});
            setContent(message ? <p className="text-green-300">{message}</p> : <p className="text-red-500">{error}</p>);
            setSubject("");
            get();
        } else setContent(<p className="text-red-500">Enter a subject</p>);
    }
    
    //Reset content value.
    useEffect(() => {
        if(!content) return;
        setLoading(false);
        setTimeout(() => {
            setContent(null);
        }, 2500);
    }, [content]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            {loaded ? (
                <div className="flex-1 flex flex-col">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2">
                        {content}
                    </div>

                    <div className="p-4 flex flex-col justify-center items-center ml-auto mr-auto mt-4 w-1/2">
                        {loading ? (
                            <h2 className="p-2 text-gray-400">Loading</h2>
                        ) : (
                            <h2 className="p-2 font-medium">Add Subject:</h2>
                        )}
                        <div className="w-full max-w-5xl p-4 border-b border-[#8d8a8a] flex flex-wrap gap-4 items-center justify-center">
                            <input
                                type="text"
                                name="subject"
                                onChange={handleChange}
                                placeholder="Enter subject code ex. FILI211"
                                className="p-2 rounded-lg bg-[#3B3B3B] placeholder-gray"
                                value={subject || ""}
                            />
                        </div>

                        <div className="p-4">
                            <button
                                className="px-4 py-2 text-gray-400 hover:text-green-500"
                                onClick={handleAdd}
                            >
                                Add
                            </button>

                            <button
                                className="px-4 py-2 text-gray-400 hover:text-red-500"
                                onClick={handleRemove}
                            >
                                Remove
                            </button>
                        </div>

                        <div className="mt-4 flex flex-col w-full min-w-[14.7rem] border-2 rounded-lg overflow-y-auto">
                            <table className="table-auto border-collapse border w-full h-full min-w-[14.5rem]">
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