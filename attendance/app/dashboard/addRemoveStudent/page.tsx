'use client';

import Sidebar from "@/components/Sidebar";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getId } from "@/tools/getId";
import {
  handleAddStudent,
  handleRemoveStudent,
  getStudent,
} from "@/app/api/requests/request";
import format from "@/tools/format";

type Student = {
  id: string;          // primary key in Supabase
  student_id: string;  // school/student number
  name: string;        // student name
  subjects: string;     // subject they’re enrolled in
};

export default function StudentRecords() {
  const router = useRouter();
  const [studentName, setStudentName] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [content, setContent] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const typeTimeout = useRef<NodeJS.Timeout | null>(null);
  const name_input = useRef<HTMLInputElement | null>(null);
  const id_input = useRef<HTMLInputElement | null>(null);
  const subject_input = useRef<HTMLInputElement | null>(null);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if(typeTimeout.current) {
      clearTimeout(typeTimeout.current);
    } 
    typeTimeout.current = setTimeout(() => {
      const temp_name = format(e.target.value);
      if(temp_name?.formatted) {
        setStudentName(temp_name.formatted);
      } else if(temp_name?.error) {
        setContent(<p className="text-red-500">{temp_name.error}</p>);
        setTimeout(() => {
          setContent("");
        }, 2000);
      }
    }, 500);
  }

  function handleIdChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStudentId(e.target.value);
  }

  function handleSubjectChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSubject(e.target.value);
  }

  const get = async () => {
    const res = await getStudent();
    setStudents(res.data || []);
  };

  useEffect(() => {
    const uid = getId();
    if (!uid) {
      alert("Unauthorized. Log in first.");
      router.push("/authPages/login");
    } 
    get();
  }, []);

  async function handleAdd() {
    if (studentName && studentId && subject) {
      const { success, error } = await handleAddStudent({
        student_id: studentId,
        name: studentName,
        subjects: subject
      });

      setContent(
        success ? (
          <p className="text-green-300">{success}</p>
        ) : (
          <p className="text-red-500">{error}</p>
        )
      );
      name_input.current && (name_input.current.value = "");
      id_input.current && (id_input.current.value = "");
      subject_input.current && (subject_input.current.value = "");
      get();
    } else {
      setContent(<p className="text-red-500">Fill all fields first</p>);
    }
  }

  async function handleRemove() {
    if (studentId) {
      const { success, error } = await handleRemoveStudent({ student_id: studentId });
      setContent(
        success ? (
          <p className="text-green-300">{success}</p>
        ) : (
          <p className="text-red-500">{error}</p>
        )
      );
      name_input.current && (name_input.current.value = "");
      id_input.current && (id_input.current.value = "");
      subject_input.current && (subject_input.current.value = "");
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
    <div className="flex">
      <Sidebar />
      <div>{content}</div>
      <div className="flex flex-row items-center flex-1 p-8 gap-8">
        <div className="p-6 border-2 rounded w-[25rem]">
          <h2 className="text-lg font-bold mb-4">Manage Students</h2>

          <label className="block mb-2">Enter Student ID:</label>
          <input
            type="text"
            onChange={handleIdChange}
            placeholder="Enter student ID"
            className="p-2 border rounded w-full mb-4"
            id="id"
            ref={id_input}
          />

          <label className="block mb-2">Enter Student Name:</label>
          <input
            type="text"
            onChange={handleNameChange}
            placeholder="Enter student name"
            className="p-2 border rounded w-full mb-4"
            id="name"
            ref={name_input}
          />

          <label className="block mb-2">Enter Subject:</label>
          <input
            type="text"
            onChange={handleSubjectChange}
            placeholder="Enter subject"
            className="p-2 border rounded w-full mb-4"
            id="subjects"
            ref={subject_input}
          />

          <div className="flex justify-between">
            <button className="p-3 text-gray-600 hover:text-green-300" onClick={handleAdd}>
                Add
            </button>
            <button className="p-3 text-gray-600 hover:text-red-500" onClick={handleRemove}>
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
                <th className="border border-gray-400 px-4 py-2">Subject</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s) => (
                  <tr key={s.id} className="text-center">
                    <td className="border border-gray-400 px-4 py-2">{s.student_id}</td>
                    <td className="border border-gray-400 px-4 py-2">{s.name}</td>
                    <td className="border border-gray-400 px-4 py-2">{s.subjects}</td>
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
