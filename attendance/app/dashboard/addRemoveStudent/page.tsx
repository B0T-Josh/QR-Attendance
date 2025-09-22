'use client';

import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getId } from "@/tools/getId";
import {
  handleAddStudent,
  handleRemoveStudent,
  getStudents,
  getStudent,
  validateTeacher
} from "@/app/api/requests/request";
import format from "@/tools/format";

type Students = {
  id: string;          // primary key in Supabase
  student_id: string;  // school/student number
  name: string;        // student name
  subjects: string;     // subject they’re enrolled in
};

export default function StudentRecords() {
  const route = useRouter();
  const [student, setStudent] = useState({
    student_id: "",
    name: "",
    subjects: ""
  })
  const [content, setContent] = useState<React.ReactElement | null>(null);
  const [students, setStudents] = useState<Students[]>([]);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });
  }

  const get = async () => {
    const res = await getStudents();
    setStudents(res.data || []);
  };

  useEffect(() => {
    if((student.name === "" && student.student_id === "" && student.subjects === "")) get();
  }, [student])

  useEffect(() => {
    setLoading(true);
    if(parseInt(getId() || '0') <= 0) {
        route.push("/authPages/login");
    }
    async function validate() {
        const {success} = await validateTeacher({uid: localStorage.getItem("id")});
        if(!success) {
          setLoading(false);
          localStorage.removeItem("id");
          route.push("/authPages/login");
        }
        setLoading(false);
    }
    validate();
    }, []);

  async function handleAdd() {
    setLoading(true);
    if (student.name && student.student_id && student.subjects) {
      const formatted = format(student.name.trim());
      if(formatted) {
        if(formatted?.error) {
          setContent(<p className="text-red-500">{formatted?.error}</p>);
        }
        if(formatted.formatted) {
          const { success, error } = await handleAddStudent({
            student_id: student.student_id,
            name: formatted.formatted,
            subjects: student.subjects.toUpperCase()
          });
          setContent(
            success ? (
              <p className="text-green-300">{success}</p>
            ) : (
              <p className="text-red-500">{error}</p>
            )
          );
          setStudent({
            ...student,
            student_id: "",
            name: "",
            subjects: ""
          });
          get();
          setLoading(false);
        }
      }
    } else {
      setLoading(false);
      setContent(<p className="text-red-500">Fill all fields first</p>);
    }
  }

  async function handleRemove() {
    setLoading(true);
    if (student.student_id) {
      const { success, error } = await handleRemoveStudent({ student_id: student.student_id });
      setContent(
        success ? (
          <p className="text-green-300">{success}</p>
        ) : (
          <p className="text-red-500">{error}</p>
        )
      );
      setStudent({
        ...student,
        student_id: "",
        name: "",
        subjects: ""
      });
      get();
      setLoading(false);
    } else {
      setLoading(false);
      setContent(<p className="text-red-500">Enter student ID to remove</p>);
    }
  }

  async function handleSearch() {
    setLoading(true);
    if((student.student_id.trim() === "" && student.name.trim() === "" && student.subjects.trim() === "")) {
      setContent(<p className="text-red-500">Enter a value first</p>);
      setLoading(false);
      return;
    }
    const {data, error} = await getStudent({student_id: student.student_id, name: student.name, subjects: student.subjects.toUpperCase()});
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
        setContent(null);
      }, 2000);
  }, [content]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col items-center flex-1 p-8 gap-8">
        {content}
        <div className="w-full max-w-5xl p-4 flex flex-row border-b border-[#8d8a8a] items-center justify-between gap-4">
          <div className="ml-[7.7rem] flex items-center gap-4 flex-1">
            {/* <label className="block mb-2">Enter Student ID:</label> */}
            <input
              type="text"
              onChange={handleChange}
              placeholder="Enter student ID"
              className="p-2 rounded-lg"
              name="student_id"
              value={student.student_id}
            />

            {/* <label className="block mb-2">Enter Student Name:</label> */}
            <input
              type="text"
              onChange={handleChange}
              placeholder="SURNAME, Firstname M.I."
              className="p-2 rounded-lg"
              name="name"
              value={student.name}
            />

            {/* <label className="block mb-2">Enter Subject:</label> */}
            <input
              type="text"
              onChange={handleChange}
              placeholder="Enter subject"
              className="p-2 rounded-lg"
              name="subjects"
              value={student.subjects}
            />
            
            
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <button className="p-3 text-gray-600 hover:text-green-300" onClick={handleAdd} disabled={loading}>
              Add
          </button>

          <button
            className="px-4 py-2 text-gray-600 hover:text-yellow-500"
            onClick={handleSearch}
            disabled={loading}
          >
            Search
          </button>

          <button
            className="px-4 py-2 text-gray-600 hover:text-red-500"
            onClick={handleRemove}
            disabled={loading}
          >
            Remove
          </button>
        </div>

        {/* Students Table */}
        <div className="w-full max-w-5xl rounded-lg overflow-auto">
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