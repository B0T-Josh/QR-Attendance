'use client';

import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getId } from "@/tools/getId"
import { handleAddSubject, handleRemoveSubject } from "@/app/api/requests/request";

export default function StudentRecords() {
    const route = useRouter();
    const [subject, setSubject] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [content, setContent] = useState<any>(null);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStudentName(e.target.value);
  }

  function handleIdChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStudentId(e.target.value);
  }

  function handleSubjectChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSubject(e.target.value);
  }

  const get = async () => {
    const res = await getStudent({ id: userId });
    setStudents(res.data || []);
  };

  useEffect(() => {
    const uid = getId();
    if (!uid) {
      alert("Unauthorized. Log in first.");
      router.push("/authPages/login");
    } else {
      setUserId(uid);
    }
  }, []);

    useEffect(() => {
        if(parseInt(getId() || '0') <= 0) {
            route.push("/authPages/login");
        }
    }, []);
    
    async function handleAdd() {
        if(subject) {
            const { message, error } = await handleAddSubject({name: subject, id: id});
            setContent(message ? <p className="text-green-300">{message}</p> : <p className="text-red-500">{error}</p>);
        } else setContent(<p className="text-red-500">Enter a subject</p>);
    }
  }

  async function handleRemove() {
    if (studentId) {
      const { message, error } = await handleRemoveStudent({ student_id: studentId });
      setContent(
        message ? (
          <p className="text-green-300">{message}</p>
        ) : (
          <p className="text-red-500">{error}</p>
        )
      );
      setStudentName("");
      setStudentId("");
      setSubject("");
      get();
    } else {
      setContent(<p className="text-red-500">Enter student ID to remove</p>);
    }
  }

  useEffect(() => {
    if (!content) return;
    const timer = setTimeout(() => setContent(""), 2500);
    return () => clearTimeout(timer);
  }, [content]);

    return (
        <div>
            <div className="z-10">
                <Sidebar />
            </div>
            
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
            </div>            
        </div>

        {/* Students Table */}
        <div className="w-full max-w-5xl border-2 rounded-lg overflow-auto">
          <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">Student ID</th>
                <th className="border border-gray-400 px-4 py-2">Name</th>
                <th className="border border-gray-400 px-4 py-2">Subject</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s) => (
                  <tr key={s.id} className="text-center">
                    <td className="border border-gray-400 px-4 py-2">{s.student_id}</td>
                    <td className="border border-gray-400 px-4 py-2">{s.name}</td>
                    <td className="border border-gray-400 px-4 py-2">{s.subject}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="border border-gray-400 px-4 py-2 text-center">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
