'use client';

import Sidebar from "@/components/Sidebar";
import {useState, useEffect} from 'react';
import { useRouter } from "next/navigation";
import { getId } from "@/components/getId"
import { handleAddStudent, handleRemoveStudent, getStudent } from "@/app/api/requests/request";

type Subjects = {
    id: string;
    student_id: string;
    name: string;
}

export default function StudentRecords() {
    const router = useRouter();
    const [studentName, setStudentName] = useState<string>("");
    const [studentId, setStudentId] = useState<string>("");
    const [userId, setUserId] = useState<string | null>(null);
    const [content, setContent] = useState<any>(null);
    const [students, setStudents] = useState<Subjects[]>([]);

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setStudentName(e.target.value);
    }

    function handleIdChange(e: React.ChangeEvent<HTMLInputElement>) {
        setStudentId(e.target.value);
    }

    const get = async () => {
        const res = await getStudent({id: userId});
        setStudents(res.data || null);
    }

    useEffect(() => {
        if(getId() === null) {
            alert("Unauthorized set. Log in first");
            router.push("/authPages/login");
        } else {
            setUserId(getId());
        }
    }, []);

    useEffect(() => {
        if(!userId) return;
        get();
    }, [userId]);
    
    async function handleAdd() {
        if (studentName && studentId) {
            const { message, error } = await handleAddStudent({
                student_id: studentId,
                name: studentName,
                user_id: userId
            });
            setContent(message ? <p className="text-green-300">{message}</p> : <p className="text-red-500">{error}</p>);
            setStudentName("");
            setStudentId("");
            get();
        } else {
            setContent(<p className="text-red-500">Enter student ID and name</p>);
        }
    }

    async function handleRemove() {
        if (studentId) {
            const { message, error } = await handleRemoveStudent({ student_id: studentId });
            setContent(message ? <p className="text-green-300">{message}</p> : <p className="text-red-500">{error}</p>);
            setStudentName("");
            setStudentId("");
            get();
        } else {
            setContent(<p className="text-red-500">Enter student ID to remove</p>);
        }
    }
    
    useEffect(() => {
        setTimeout(() => {
            setContent("");
        }, 2500);
    }, [content]);

    return (
  <div className="flex">
    <Sidebar />

    <div className="flex flex-col items-center flex-1 p-8 gap-8">
      {/* Feedback message */}
      <div>{content}</div>

      {/* Manage Students Form */}
      <div className="p-6 border-2 rounded w-[25rem]">
        <h2 className="text-lg font-bold mb-4">Manage Students</h2>

        <label className="block mb-2">Enter Student ID:</label>
        <input
          type="text"
          onChange={handleIdChange}
          placeholder="Enter student ID"
          className="p-2 border rounded w-full mb-4"
          value={studentId}
        />

        <label className="block mb-2">Enter Student Name:</label>
        <input
          type="text"
          onChange={handleNameChange}
          placeholder="Enter student name"
          className="p-2 border rounded w-full mb-4"
          value={studentName}
        />

        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
            onClick={handleAdd}
          >
            Add
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
            onClick={handleRemove}
          >
            Remove
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="w-full max-w-5xl border-2 rounded-lg overflow-auto">
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2">Student ID</th>
              <th className="border border-gray-400 px-4 py-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((s) => (
                <tr key={s.id} className="text-center">
                  <td className="border border-gray-400 px-4 py-2">{s.id}</td>
                  <td className="border border-gray-400 px-4 py-2">{s.student_id}</td>
                  <td className="border border-gray-400 px-4 py-2">{s.name}</td>
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
)};
