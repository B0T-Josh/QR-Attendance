'use client';

import Sidebar from "@/components/Sidebar";
import { useState, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getId } from "@/tools/getId";
import {
  handleAddStudent,
  handleRemoveStudent,
  getStudents,
  getStudent
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
  const [subjects, setSubjects] = useState<string>("");
  const [content, setContent] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const typeTimeout = useRef<NodeJS.Timeout | null>(null);
  const name_input = useRef<HTMLInputElement | null>(null);
  const id_input = useRef<HTMLInputElement | null>(null);
  const subject_input = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStudentName(e.target.value);
  }

  function handleIdChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStudentId(e.target.value);
  }

  function handleSubjectChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSubjects(e.target.value.toUpperCase());
  }

  const get = async () => {
    const res = await getStudents();
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
    setLoading(true);
    if (studentName && studentId && subjects) {
      const formatted = format(studentName);
      if(formatted?.error) {
        setContent(<p className="text-red-500">Invalid format.<br/>Must be SURNAME, Firstname M.I.</p>);
        return;
      }
      const { success, error } = await handleAddStudent({
        student_id: studentId,
        name: formatted?.formatted,
        subjects: subjects
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
      setLoading(false);
    } else {
      setLoading(false);
      setContent(<p className="text-red-500">Fill all fields first</p>);
    }
  }

  async function handleRemove() {
    setLoading(true);
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
      setLoading(false);
    } else {
      setLoading(false);
      setContent(<p className="text-red-500">Enter student ID to remove</p>);
    }
  }

  async function handleSearch() {
    setLoading(true);
    if(!(studentId || studentName || subjects)) {
      setContent(<p className="text-red-500">Enter a value first</p>);
      setLoading(false);
      return;
    }
    const {data, error} = await getStudent({student_id: studentId, name: studentName, subjects: subjects});
    if(data) {
      setStudents(data || []);
      setLoading(false);
    } else {
      setContent(<p className="text-red-500">{error}</p>);
      setLoading(false);
    }
  }

  useEffect(() => {
    if(!content) return;
    setTimeout(() => {
        setContent("");
      }, 2000);
  }, [content]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col items-center flex-1 p-8 gap-8">
        {content}
        <div className="w-full max-w-5xl p-4 border-b border-[#c7c7c79f] flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <input
              type="text"
              onChange={handleIdChange}
              placeholder="Enter student ID"
              className="p-2 rounded-lg"
              id="id"
              ref={id_input}
            />

            <input
              type="text"
              onChange={handleNameChange}
              placeholder="Enter student name"
              className="p-2 rounded-lg"
              id="name"
              ref={name_input}
            />

            <input
              type="text"
              onChange={handleSubjectChange}
              placeholder="Enter subject"
              className="p-2 rounded-lg"
              id="subjects"
              ref={subject_input}
            />
          </div>
          
          <div className="flex gap-4">
            <button
              className="px-4 py-2 text-gray-600 hover:text-green-500"
              onClick={handleAdd}
            >
              Add
            </button>

            <button
              className="px-4 py-2 text-gray-600 hover:text-yellow-500"
              onClick={handleSearch}
            >
              Search
            </button>

            <button
              className="px-4 py-2 text-gray-600 hover:text-red-500"
              onClick={handleRemove}
            >
              Remove
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="w-full max-w-5xl border-2 border-[#8d8a8a] rounded-lg overflow-auto">
          <table className="table-auto border-collapse border-[#8d8a8a] w-full">
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
